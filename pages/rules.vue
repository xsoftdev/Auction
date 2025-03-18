<template>
    <div class="max-w-[1600px] mx-auto p-6">
        <UContainer>
            <UCard class="mb-8">
                <template #header>
                    <h1 class="text-2xl font-bold">Правила користування сайтом</h1>
                </template>
            </UCard>

            <!-- Раздел продавцов -->
            <UCard class="mb-8">
                <template #header>
                    <h2 class="text-xl font-semibold">1. Вимоги до продавців</h2>
                </template>
                <div class="space-y-4">
                    <div class="prose">
                        <p><span class="font-medium">1.1.</span> Заборонено виставляти на торги/продаж мультилоти
                            (більше одного
                            предмету в лоті з роздільними цінами).</p>
                    </div>

                    <UDivider />

                    <div class="prose">
                        <p><span class="font-medium">1.2.</span> Назва лота не повинна містити зайву інформацію.</p>
                        <p class="mt-2">Зображення лота повинні бути оригінальними, максимально якісними та
                            інформативними.</p>
                    </div>

                    <UDivider />

                    <div>
                        <p class="font-medium mb-2">1.3. Заборонено:</p>
                        <UList>
                            <UListItem>достроково знімати лот із торгів</UListItem>
                            <UListItem>змінювати стартову ціну лота, в якому зроблено ставку</UListItem>
                            <UListItem>вносити зміни у дату/час закінчення торгів за лотом</UListItem>
                            <UListItem>виставляти на торги заборонені знаряддя лову</UListItem>
                        </UList>
                    </div>
                </div>
            </UCard>

            <!-- Раздел покупателей -->
            <UCard class="mb-8">
                <template #header>
                    <h2 class="text-xl font-semibold">2. Вимоги до покупців</h2>
                </template>
                <div class="space-y-4">
                    <div class="prose">
                        <p><span class="font-medium">2.1.</span> Заборонено знімати ставку або відмовлятися від оплати
                            купленого
                            лота, якщо в ньому немає дефектів, тріщин, відколів і т.п.</p>
                    </div>

                    <UDivider />

                    <div class="prose">
                        <p><span class="font-medium">2.2.</span> Покупцеві для оплати купленого лота виділяється не
                            більше 72-х
                            годин (3-х діб) з моменту отримання реквізитів.</p>
                    </div>
                </div>
            </UCard>

            <!-- Раздел отзывов -->
            <UCard class="mb-8">
                <template #header>
                    <h2 class="text-xl font-semibold">3. Відгуки, коментарі, чати за угодами</h2>
                </template>
                <div class="space-y-4">
                    <div class="prose">
                        <p><span class="font-medium">3.1.</span> Користувачам з позитивним балансом доступні опції
                            "Залишити
                            відгук".</p>
                    </div>

                    <UDivider />

                    <div class="prose">
                        <p><span class="font-medium">3.2.</span> Коментарі до лота – це зафіксована графічна, текстова
                            інформація.
                        </p>
                    </div>
                </div>
            </UCard>

            <!-- Остальные разделы... -->

        </UContainer>
    </div>
</template>

<style scoped>
.prose {
    @apply text-base leading-7;
}
</style>
