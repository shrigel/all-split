export function allocateEqual(amount, recipientIds) {
    if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new RangeError(
            "Allocation amount must be a non-negative safe integer."
        );
    }

    if (!Array.isArray(recipientIds)) {
        throw new TypeError(
            "recipientIds must be an array."
        );
    }

    if (recipientIds.length === 0) {
        return [];
    }

    const baseAmount = Math.floor(amount / recipientIds.length);

    const remainder = amount % recipientIds.length;

    return recipientIds.map(
        (participantId, index) => ({
            participantId,
            amount: baseAmount + (index < remainder ? 1 : 0)
        })
    );
}

export function allocateProportional(amount, recipients) {
    if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new RangeError(
            "Allocation amount must be a non-negative safe integer."
        );
    }

    if (!Array.isArray(recipients)) {
        throw new TypeError(
            "recipients must be an array."
        );
    }

    if (recipients.length === 0) {
        return [];
    }

    const totalWeight = recipients.reduce(
        (sum, recipient) => {
            if (
                !Number.isSafeInteger(recipient.weight) ||
                recipient.weight < 0
            ) {
                throw new RangeError(
                    "Allocation weight must be a non-negative safe integer."
                );
            }

            return sum + recipient.weight;
        }, 0
    );

    if (totalWeight === 0) {
        if (amount === 0) {
            return recipients.map(
                ({ participantId }) => ({
                    participantId,
                    amount: 0
                })
            );
        }

        throw new RangeError(
            "Cannot allocate a positive amount with zero total weight."
        );
    }

    const allocations = recipients.map(
        ({ participantId, weight }, index) => {
            const numerator = amount * weight;

            return {
                participantId,
                amount: Math.floor(numerator / totalWeight),
                remainder:
                    numerator % totalWeight,
                index
            };
        }
    );

    const allocatedAmount = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);

    const remainingAmount = amount - allocatedAmount;

    const remainderOrder = [...allocations]
        .sort((a, b) => {
            if (b.remainder !== a.remainder) {
                return b.remainder - a.remainder;
            }

            return a.index - b.index;
        });

    for (let index = 0; index < remainingAmount; index++) {
        remainderOrder[index].amount += 1;
    }

    return allocations.map(
        ({ participantId, amount }) => ({
            participantId,
            amount
        })
    );
}