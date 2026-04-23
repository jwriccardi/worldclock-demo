<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-04-23 | Updated: 2026-04-23 -->

# .github/workflows

## Purpose
GitHub Actions CI/CD pipeline that automatically builds a Docker image and deploys it to Google Cloud Run on every push to `main`.

## Key Files

| File | Description |
|------|-------------|
| `deploy.yml` | Single workflow: checkout → GCP auth → build & push Docker image → deploy to Cloud Run |

## For AI Agents

### Working In This Directory
- The workflow triggers on **push to `main`** only — no PR checks, no manual dispatch.
- Authentication uses **Workload Identity Federation** (not a long-lived service account key). The `id-token: write` permission is required for this to work.
- GCP resources are hardcoded as `env` variables at the top of the job:
  - `PROJECT_ID`: `johnriccardi-com`
  - `REGION`: `us-central1`
  - `SERVICE`: `worldclock`
  - `IMAGE`: `us-central1-docker.pkg.dev/johnriccardi-com/worldclock/app`
- Images are pushed with two tags: `${{ github.sha }}` (immutable) and `latest`.
- Deployment uses `google-github-actions/deploy-cloudrun@v2` with the SHA-tagged image for traceability.

### Testing Requirements
- Workflow changes can only be fully tested by pushing to `main` (no local runner equivalent for GCP auth steps).
- Validate YAML syntax with `yamllint` or GitHub's workflow editor before pushing.

### Common Patterns
- To add a new environment variable to Cloud Run, add a `env_vars` key to the `deploy-cloudrun` step.
- To change the trigger (e.g., add manual dispatch), add `workflow_dispatch:` under the `on:` block.

## Dependencies

### External
- `actions/checkout@v4`
- `google-github-actions/auth@v2` — Workload Identity Federation
- `google-github-actions/setup-gcloud@v2`
- `google-github-actions/deploy-cloudrun@v2`
- GCP Workload Identity Pool: `projects/663548056146/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
- GCP Service Account: `github-actions-deploy@johnriccardi-com.iam.gserviceaccount.com`

<!-- MANUAL: -->
