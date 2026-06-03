---
name: foundry-cli
description: Azure AI Foundry CLI helper — deploy models, manage resources, and run common operations via `az cognitiveservices`. Use when you need to provision Foundry resources, deploy LLMs (like gpt-4o-mini), fetch endpoint credentials, or troubleshoot CLI failures during a hackathon.
argument-hint: [setup | create <name> | deploy <model> | list | get-creds <name>]
allowed-tools:
  - Bash
  - Read
---

# Azure AI Foundry CLI Helper

This skill gets you from zero to a working `gpt-4o-mini` endpoint on Azure AI Foundry in under 5 minutes, using `az cognitiveservices` (the actual CLI family — `az ai` does **not** exist, despite what older docs and AI agents will sometimes hallucinate).

**When to use:** during a hackathon or rapid prototype where you need a Foundry resource + a deployed model fast, and you don't want to fight the Azure portal.

**When not to use:** for long-lived production infrastructure (use Bicep/Terraform instead) or for fine-tuning, evaluations, or custom RBAC.

---

## Commands

| Command | What it does |
|---------|--------------|
| `/foundry-cli setup` | One-time setup: login, install extension, set subscription |
| `/foundry-cli create <name>` | Create resource group + Foundry resource + deploy `gpt-4o-mini`, all in one flow |
| `/foundry-cli deploy <model>` | Deploy a specific model to an existing Foundry resource |
| `/foundry-cli list` | List resources, deployments, and quotas |
| `/foundry-cli get-creds <name>` | Get endpoint URL and API key for a resource |

If `$ARGUMENTS` is empty, show the table above and ask what the user wants to do.

---

## Common gotchas (read this first)

1. **The command family is `az cognitiveservices`, not `az ai`.** If someone (or an AI agent) gives you `az ai model deploy`, it's wrong. The Azure CLI has no `az ai` command group.
2. **You need the `cognitiveservices` extension installed.** Without it, the create/deploy commands fail silently.
3. **Foundry resources are created with `--kind AIServices`** (not `OpenAI`, not `CognitiveServices`).
4. **Always set the subscription explicitly** if the user has more than one — resources end up in the wrong place otherwise.
5. **`--sku-capacity` of 1 = 1K TPM**, which rate-limits within minutes during a hackathon. Use 10 (10K TPM) as a baseline.
6. **Model version matters.** Use `2024-07-18` for `gpt-4o-mini` (the GA version as of this skill's writing).
7. **Deploy time:** realistic is 1–2 minutes for `gpt-4o-mini` on `GlobalStandard`, not 90 seconds.

---

## Command: `setup`

**Trigger:** `/foundry-cli setup`

One-time setup. Run this once per machine before anything else.

```bash
# 1. Login
az login

# 2. Install the cognitiveservices extension
az extension add -n cognitiveservices

# 3. List subscriptions and set the right one
az account list --output table
az account set --subscription "<SUBSCRIPTION_ID_OR_NAME>"

# 4. Verify
az account show --query "{name:name, id:id}" -o table
```

**Steps Claude should walk the user through:**

1. Check if `az` is installed (`az --version`). If not, point them to <https://learn.microsoft.com/cli/azure/install-azure-cli>.
2. Run `az login` and confirm the browser flow completes.
3. Run the extension install.
4. List subscriptions; ask the user which one to use; run `az account set`.
5. Verify with `az account show`.

---

## Command: `create`

**Trigger:** `/foundry-cli create <name>`

Creates a resource group, a Foundry (AIServices) resource, and deploys `gpt-4o-mini` — all in one flow. This is the "get me a working endpoint" path.

```bash
NAME="<name>"            # e.g. "team-7" or "hackathon-bago"
RG="rg-${NAME}"
LOC="eastus2"            # also valid: eastus, westus, swedencentral
ACC="foundry-${NAME}"

# Resource group
az group create -n $RG -l $LOC

# Foundry resource (AIServices kind)
az cognitiveservices account create \
  -n $ACC -g $RG \
  --kind AIServices \
  --sku S0 \
  --location $LOC \
  --custom-domain $ACC \
  --yes

# Deploy gpt-4o-mini
az cognitiveservices account deployment create \
  -n $ACC -g $RG \
  --deployment-name gpt-4o-mini \
  --model-name gpt-4o-mini \
  --model-version "2024-07-18" \
  --model-format OpenAI \
  --sku-name GlobalStandard \
  --sku-capacity 10

# Fetch endpoint + key for your code
ENDPOINT=$(az cognitiveservices account show -n $ACC -g $RG --query properties.endpoint -o tsv)
KEY=$(az cognitiveservices account keys list -n $ACC -g $RG --query key1 -o tsv)

echo "AZURE_OPENAI_ENDPOINT=$ENDPOINT"
echo "AZURE_OPENAI_API_KEY=$KEY"
echo "AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini"
```

**Steps Claude should walk the user through:**

1. Confirm `setup` was already run (check `az account show`).
2. Ask for the `<name>` (will be used as suffix for RG and resource).
3. Confirm region — default `eastus2`, but ask if they have quota issues elsewhere.
4. Run the resource group create, then the resource create, then the deployment create — wait for each to complete before the next.
5. Fetch endpoint and key and present them to the user, ready to paste into `.env`.
6. Suggest the variable names (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`) that match the example code in this toolkit.

**Time budget:** 2–4 minutes wall-clock. The deployment step is the slowest.

---

## Command: `deploy`

**Trigger:** `/foundry-cli deploy <model>`

Deploy an additional model to an existing Foundry resource. Use this when `create` already ran but you want to add, say, `gpt-4o` for richer outputs in addition to `gpt-4o-mini`.

```bash
RG="<resource-group>"
ACC="<account-name>"
MODEL="<model-name>"     # e.g. "gpt-4o", "text-embedding-3-small", "o3-mini"
VERSION="<model-version>" # check: az cognitiveservices model list

az cognitiveservices account deployment create \
  -n $ACC -g $RG \
  --deployment-name $MODEL \
  --model-name $MODEL \
  --model-version "$VERSION" \
  --model-format OpenAI \
  --sku-name GlobalStandard \
  --sku-capacity 10
```

**Steps Claude should walk the user through:**

1. List available models: `az cognitiveservices model list -l $LOC -o table | grep OpenAI`
2. Ask which model and which version.
3. Run the deployment.
4. Confirm with `list`.

---

## Command: `list`

**Trigger:** `/foundry-cli list`

Show what exists. Useful for "what did I deploy and where?"

```bash
# All Foundry resources in current subscription
az cognitiveservices account list --query "[?kind=='AIServices'].{Name:name, RG:resourceGroup, Location:location}" -o table

# All deployments inside a given resource
az cognitiveservices account deployment list \
  -n <account-name> -g <resource-group> \
  --query "[].{Deployment:name, Model:properties.model.name, Version:properties.model.version, Capacity:sku.capacity}" \
  -o table

# Quota usage for a region
az cognitiveservices usage list -l eastus2 -o table
```

---

## Command: `get-creds`

**Trigger:** `/foundry-cli get-creds <name>`

Re-fetch endpoint and key for a resource. Useful when the team rotated to a new machine or someone lost the `.env`.

```bash
RG="rg-<name>"
ACC="foundry-<name>"

ENDPOINT=$(az cognitiveservices account show -n $ACC -g $RG --query properties.endpoint -o tsv)
KEY=$(az cognitiveservices account keys list -n $ACC -g $RG --query key1 -o tsv)

cat <<EOF
AZURE_OPENAI_ENDPOINT=$ENDPOINT
AZURE_OPENAI_API_KEY=$KEY
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
EOF
```

---

## Prerequisites checklist

Before any of these commands work:

- [ ] Azure CLI `>= 2.60` installed (`az --version`)
- [ ] An Azure **subscription** with quota for `gpt-4o-mini` on GlobalStandard in your chosen region
- [ ] RBAC: **Contributor** or **Owner** on the subscription (needed to create RG + resource). **Cognitive Services Contributor** on the resource is enough for deployments only.
- [ ] `cognitiveservices` extension installed (`az extension add -n cognitiveservices`)
- [ ] If multi-subscription: `az account set --subscription <id>` run explicitly

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `az: 'ai' is not in the 'az' command group` | You used `az ai ...` | Use `az cognitiveservices ...` instead |
| `MissingSubscriptionRegistration` | Subscription hasn't registered the `Microsoft.CognitiveServices` provider | Run `az provider register -n Microsoft.CognitiveServices --wait` |
| `InvalidApiVersionParameter` on deploy | Wrong `--model-version` | Run `az cognitiveservices model list -l <loc> -o table` to see valid versions |
| `429 Too Many Requests` from your code | `--sku-capacity` too low for your usage | Re-deploy with higher `--sku-capacity` or wait |
| `LocationNotAvailableForResourceType` | Region doesn't support the model | Try `eastus2`, `eastus`, `westus`, or `swedencentral` |

---

## Sources

- [Azure CLI `cognitiveservices account` reference](https://learn.microsoft.com/cli/azure/cognitiveservices/account)
- [Azure CLI `cognitiveservices account deployment` reference](https://learn.microsoft.com/cli/azure/cognitiveservices/account/deployment)
- [Deploy models with Azure CLI (Foundry docs)](https://learn.microsoft.com/azure/ai-foundry/foundry-models/how-to/create-model-deployments)
- [Create a Foundry resource (multi-service docs, azcli pivot)](https://learn.microsoft.com/azure/ai-services/multi-service-resource?pivots=azcli)
