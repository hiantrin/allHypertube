
const apiResponse = (status, errors, results) => {
    return JSON.stringify(
        status === 0 ? {"status": status, "error": errors} : {"status": status , "data": results}
        );
}

module.exports = apiResponse;