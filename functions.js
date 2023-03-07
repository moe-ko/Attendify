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
