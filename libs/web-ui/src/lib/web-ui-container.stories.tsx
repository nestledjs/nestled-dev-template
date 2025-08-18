import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { WebUiContainer } from './web-ui-container';
import type { StoryContext } from '@storybook/react';

const meta = {
  component: WebUiContainer,
  title: 'WebUi/Container',
  tags: ['autodocs'],
  args: {
    children: 'This is a container',
  },
} satisfies Meta<typeof WebUiContainer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBlur: Story = {
  args: {
    blur: 'top-right',
    children: 'Container with blur effect',
  },
};

export const Centered: Story = {
  args: {
    center: true,
    children: 'Centered content',
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    // Check that the content is present
    await expect(canvas.getByText('Centered content')).toBeInTheDocument();
    // Optionally, check for centering class
    const contentDiv = canvas.getByText('Centered content').parentElement;
    await expect(contentDiv?.className).toMatch(/items-center/);
  },
}; 