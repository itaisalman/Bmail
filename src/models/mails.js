let idCounter = 0
const mails = []

const getFiftyMails = () => {
    if ( mails.length < 50){
        return mails
    }
    const fifty_mails = []
    let i = mails.length - 1
    for (i ; i > mails.length - 50; i--){
        fifty_mails.push(mails[i]);
    }
    return fifty_mails
}

module.exports = {
    getFiftyMails
}