import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from 'storybook/test';
import { WebUiFooter } from './web-ui-footer';
import type { StoryContext } from '@storybook/react';

const meta = {
  component: WebUiFooter,
  title: 'WebUi/Footer',
  tags: ['autodocs'],
} satisfies Meta<typeof WebUiFooter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Your Site/)).toBeInTheDocument();
    await expect(canvas.getByText('Privacy Policy')).toBeInTheDocument();
  },
};
