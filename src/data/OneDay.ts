import axios from 'axios';
type DataItem =  {
    "phen": string,
    "time": string
}

export type OneDayModel = {
    "apiversion": string,
    "geometry": {
        "coordinates": [
            number,
            number
        ],
        "type": string
    },
    "properties": {
        "data": {
            "closestphase": {
                "day": number,
                "month": number,
                "phase": string,
                "time": string,
                "year": number
            },
            "curphase": string,
            "day": number,
            "day_of_week": string,
            "fracillum": string,
            "isdst": false,
            "label": null,
            "month": number,
            "moondata": Array<DataItem>,
            "sundata": Array<DataItem>,
            "tz": number,
            "year": number
        }
    },
    "type": string
}

const URL = 'https://aa.usno.navy.mil/api/rstt/oneday';

const retrieveOneDay = async (date: Date, coords: [number, number]) => {
    const options = {
        params: {
            date,
            coords: coords.join(',')
        }
    };

    try {
        const response = await axios.get(URL, options);
        const data = await response.data as OneDayModel;

        return data;
    } catch (error) {
        throw Error(JSON.stringify(error))
    }
}

export {
    retrieveOneDay,
}