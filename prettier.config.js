module.exports = {
  tailwindConfig: './tailwind.config.js',
  plugins: [require('prettier-plugin-tailwindcss')],
  trailingComma: "es5",
  bracketSameLine: false,
  arrowParens: "always",
  singleAttributePerLine: false,
  overrides: [
    {
      files: "*.ts",
      options: {
        singleQuote: true
      }
    }
  ]
}
