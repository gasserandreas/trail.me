module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'chore: release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}', // eslint-disable-line no-template-curly-in-string, max-len
      },
    ],
  ],
  verifyConditions: ['@semantic-release/npm', '@semantic-release/changelog'],
  prepare: ['@semantic-release/changelog', '@semantic-release/git'],
  fail: false,
  success: false,
  branch: 'master',
};