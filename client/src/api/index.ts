import {ApiResponse} from './types';

//Basic GET function for utilities
export const GET = async (apiURL: string): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            credentials: 'include',
        });

        const contentType = response.headers.get('content-type') || '';

        //check if response is JSON
        if (contentType.includes('application/json')) {

            //return if json
            const obj = await response.json();

            if (response.ok) {
                return { data: obj, status: response.status };
            } else {
                console.log(obj.error);
                return { error: obj.error || 'Network response was not ok', status: response.status };
            }
        } else {
            //handle HTML error pages
            const html = await response.text();
            console.error('Expected json but got:', html);
            return {
                error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
                status: 400,
            };
        }
    } catch (error: any) {
        console.error('GET error', error);
        return { error: error.message || 'Unknown error', status: 500 };
    };
};



//Basic POST function
export const POST = async (apiURL: string, newData: Object): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newData),
        });

        const contentType = response.headers.get('content-type') || '';

        //check if response is JSON
        if (contentType.includes('application/json')) {
            //return if json
            const obj = await response.json();

            if (response.ok) {
                return { data: obj, status: response.status };
            } else {
                console.log(obj.error);
                return { error: obj.error || 'Network response was not ok', status: response.status };
            }
        } else {
            //handle HTML error pages
            const html = await response.text();
            console.error('Expected json but got:', html);
            return {
                error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
                status: 400,
            };
        }
    } catch (error: any) {
        console.error('POST error:', error);
        return { error: error.message || 'Unknown error', status: 400, };
    };
};


//Basic PUT function
export const PUT = async (apiURL: string, newData: Object): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(apiURL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newData),
        });

        const contentType = response.headers.get('content-type') || '';

        //check if response is JSON
        if (contentType.includes('application/json')) {
            //return if json
            const obj = await response.json();

            if (response.ok) {
                return { data: obj, status: response.status };
            } else {
                console.log(obj.error);
                return { error: obj.error || 'Network response was not ok', status: response.status };
            }
        } else {
            //handle HTML error pages
            const html = await response.text();
            console.error('Expected json but got:', html);
            return {
                error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
                status: 400,
            };
        }
    } catch (error: any) {
        console.error('POST error:', error);
        return { error: error.message || 'Unknown error', status: 400, };
    };
};



//Basic DELETE function
export const DELETE = async (apiURL: string): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(apiURL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const contentType = response.headers.get('content-type') || '';

        //check if response is JSON
        if (contentType.includes('application/json')) {
            //return if json
            const obj = await response.json();

            if (response.ok) {
                return { data: obj, status: response.status };
            } else {
                console.log(obj.error);
                return { error: obj.error || 'Network response was not ok', status: response.status };
            }
        } else {
            //handle HTML error pages
            const html = await response.text();
            console.error('Expected json but got:', html);
            return {
                error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
                status: 400,
            };
        }
    } catch (error: any) {
        console.error('POST error:', error);
        return { error: error.message || 'Unknown error', status: 400, };
    };
};


//jsonify the data
export function jsonify<_data = any>(
    data: _data,
    status: number,
    error: string | null = null,
    mimetype = 'application/json'
) {
    return {
        status,
        mimetype,
        data,
        error,
    };
};


//RESPONSE function
export const RESPONSE = <_data = any>(
    status: number,
    error: string | null = null,
    data: _data | null = null,
) => {
    return jsonify(data, status, error)
}
