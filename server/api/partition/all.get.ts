import { Partition } from "./partition.schema";

export default defineEventHandler(async () => {
    try {
        const partitions = await Partition.aggregate([
            {
                $lookup: {
                    from: 'lots',
                    localField: 'lots',
                    foreignField: '_id',
                    as: 'lotsArray'
                }
            },
            {
                $addFields: {
                    haveLots: { $gt: [{ $size: '$lotsArray' }, 0] },
                    'subcategories': {
                        $map: {
                            input: '$subcategories',
                            as: 'sub',
                            in: {
                                $mergeObjects: [
                                    '$$sub',
                                    {
                                        haveLots: {
                                            $gt: [{ $size: { $ifNull: ['$$sub.lots', []] } }, 0]
                                        },
                                        subcategories: {
                                            $map: {
                                                input: '$$sub.subcategories',
                                                as: 'subsub',
                                                in: {
                                                    $mergeObjects: [
                                                        '$$subsub',
                                                        {
                                                            haveLots: {
                                                                $gt: [{ $size: { $ifNull: ['$$subsub.lots', []] } }, 0]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    lotsArray: 0
                }
            }
        ]);

        return partitions;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `${error}`, data: error });
    }
});