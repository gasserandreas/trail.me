module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    // "../src/**/*.stories.@(js|jsx|ts|tsx)"
    "../src/**/*.stories.@(ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    '@storybook/addon-actions',
    "@storybook/addon-essentials",
    '@storybook/addon-knobs',
    '@storybook/addon-viewport',
    "@storybook/preset-create-react-app"
  ]
}