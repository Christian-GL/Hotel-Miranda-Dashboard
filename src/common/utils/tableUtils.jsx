
export const formatToTerm = (phrase) => {
    const wordsSplited = phrase.replace('_', ' ').split(' ');
    for (let i = 0; i < wordsSplited.length; i++) {
        wordsSplited[i] = wordsSplited[i][0].toUpperCase() + wordsSplited[i].substr(1);
        wordsSplited[i] += ' '
    }
    return wordsSplited
}
