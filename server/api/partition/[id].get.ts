import { Partition } from "./partition.schema";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID не указан' });
    }
    try {
        const partition = await Partition.findById(id);
        if (!partition) {
            throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' });
        }

        return { success: true, data: partition };
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Ошибка базы данных', data: error });
    }
});
