import NetInfo from "@react-native-community/netinfo";

export const checkConnection = () => {
    // alert('Checking connection')
    return NetInfo.fetch().then(state => {
        return state.isConnected
    });
}

export const checkIpAddress = () => {
    return NetInfo.fetch().then(state => {
        return state.details.ipAddress

    });
}

export const generatePasscode = (length) => {
    let passcode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        passcode += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return passcode;
}