import AWS from 'aws-sdk';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:acdb3c1d-7a2a-4a46-b4d5-1cf1cdfe0649',
});

const client = new AWS.Location({
    credentials: AWS.config.credentials,
    region: AWS.config.region // region containing the identity pool
});

async function getLocation(longitude: number, latitude: number, cb: (location: string) => void){

    client.searchPlaceIndexForPosition({
        IndexName: 'moonPhaseApp',
        Position: [longitude, latitude]
    }, (error, data) => {
        if (error) {
            throw Error(JSON.stringify(error))
        }
        cb(`${data.Results[0].Place.Municipality}, ${data.Results[0].Place.Region}` ?? "Not Found");
    });
    
}

export {
    getLocation
}
