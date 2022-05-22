export type GeolocationResponse = {
    message: string
    position?: GeolocationPosition
    error?: GeolocationPositionError
}

const handleGeolocation = () => {
    return new Promise<GeolocationResponse>((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                message: 'Location not enabled.'
            });
        }

        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                message: 'Location found.',
                position
            });
        }, (error) => {
            reject({
                message: 'Location not found.',
                error
            });
        });
    });
}

export {
    handleGeolocation
}