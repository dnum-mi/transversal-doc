// Delimiters of the key points inside a generated skill, so that tools can tell quoted text from written text.
export const keyPointsStart = page => `<!-- key-points:start ${page} -->`
export const KEY_POINTS_END = '<!-- key-points:end -->'

const QUOTED = new RegExp(`<!-- key-points:start [^>]*-->[\\s\\S]*?${KEY_POINTS_END}`, 'g')

export const withoutKeyPoints = body => body.replace(QUOTED, '')
