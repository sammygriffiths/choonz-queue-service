'use strict';

module.exports = {
    calculateNewQueuePosition: (currentQueuePosition, lastAddedPosition) => {
        return new Promise((resolve, reject) => {
            if (
                !Number.isInteger(currentQueuePosition + lastAddedPosition) ||
                !(currentQueuePosition >= 0) || !(lastAddedPosition >= 0)
            ) {
                return reject(new Error('currentQueuePosition and lastAddedPosition should be positive integers'));
            }

            if (lastAddedPosition > currentQueuePosition) {
                return resolve(lastAddedPosition + 1);
            } else {
                return resolve(currentQueuePosition + 1);
            }
        });
    }
}
