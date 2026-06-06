import type { Meta, StoryObj } from "@storybook/react";
import { Banner, ToastProvider, useToast } from "@/components/ui";
import { Button } from "@/components/ui";

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------
const BannerMeta: Meta<typeof Banner> = {
  title: "Feedback/Banner",
  component: Banner,
  tags: ["autodocs"],
  args: { message: "Tournament field updated for Masters 2026." },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
};
export default BannerMeta;
type BannerStory = StoryObj<typeof Banner>;

export const Info: BannerStory = { args: { tone: "info" } };
export const Success: BannerStory = {
  args: { tone: "success", message: "Projections refreshed successfully." },
};
export const Warning: BannerStory = {
  args: { tone: "warning", message: "Live scoring delayed — data may be stale." },
};
export const Error: BannerStory = {
  args: { tone: "error", message: "Model error: missing round data for 3 players." },
};

// ---------------------------------------------------------------------------
// Toast (interactive)
// ---------------------------------------------------------------------------
function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex gap-3">
      <Button onClick={() => toast({ title: "Projections updated", tone: "success" })}>
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Weather delay expected", tone: "warning" })}
      >
        Warning
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast({ title: "API error — retrying", tone: "error" })}
      >
        Error
      </Button>
    </div>
  );
}

export const ToastStory: StoryObj = {
  name: "Toast",
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
