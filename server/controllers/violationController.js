const axios = require('axios'); // Ensure axios is required

exports.handleViolation = async (req, res) => {
    try {
        const { plateNo } = req.body;

        if (!plateNo) {
            console.warn('plateNo is missing from the request body:', req.body);
            return res.status(400).json({ message: 'plateNo is required.' });
        }

        const upperPlateNo = plateNo.toUpperCase();

        console.info('Received violation data:', req.body);

        // Construct the vehicle info URL
        const vehicleInfoUrl = `http://localhost:8800/getinfo/${encodeURIComponent(upperPlateNo)}`;

        // Fetch vehicle information from the external API
        const response = await axios.get(vehicleInfoUrl, {timeout: 1000});
        const vehicleInfo = response.data;

        console.info('Vehicle Info:', vehicleInfo);

        // Assemble the data to send
        const dataToSend = {
            vin: vehicleInfo.cabinNo || '', // VIN number from cabinNo
            plate: upperPlateNo,
            rfidTag: vehicleInfo.rfidTag || '',
            color: vehicleInfo.colorName || '',
            class: vehicleInfo.className || '',
            model: vehicleInfo.modelName || '',
            mark: vehicleInfo.markName || '',
            full_photo: req.body.full_photo || '',
            timestamp: String(Date.now()), // Current Unix timestamp in milliseconds
            longitude: req.body.longitude || '',
            latitude: req.body.latitude || '',
            from: req.body.from || '',
            host_id: req.body.device_id || '' // host_id from device_id
        };

        // **Log the data being sent to the external service**
        console.info('Data to send to external service:', dataToSend);

        // External endpoint
        const sendEndpoint = 'http://localhost:5004/api/service/violation';

        // Send HTTP POST request
        const sendResponse = await axios.post(sendEndpoint, dataToSend, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic b2R0Om9kdDEyMzQ1Ng==' // Modify if necessary
            }
        });

        console.info('Response from external service:', sendResponse.data);

        // Send response back to the client
        res.status(200).json({
            message: 'Violation data received and processed successfully.',
            // vehicleInfo: vehicleInfo,
            // externalServiceResponse: sendResponse.data
        });
    } catch (error) {
        // Enhanced Error Logging
        console.error('Error handling violation:', {
            message: error.message,
            stack: error.stack,
            ...(error.response && {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            }),
            ...(error.request && { request: error.request })
        });

        res.status(500).json({ message: 'Internal Server Error' });
    }
};
