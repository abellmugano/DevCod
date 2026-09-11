import { GitHubAdapter } from "../../../src/adapters/vcs/github.ts";

export { GitHubAdapter };

export function createVCSAdapter(): GitHubAdapter {
  return new GitHubAdapter({
    token: Deno.env.get("GITHUB_TOKEN")!,
    webhookSecret: Deno.env.get("GITHUB_WEBHOOK_SECRET")!,
  });
}
