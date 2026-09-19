# نشط وثب Assistant إعادة وصل أساس دقيق

[English](README.md) | العربية

[reconnect.bench.client.ts](reconnect.bench.client.ts) قياس كمية إعادة وصل يحمل واحد يتضمن 100,000 عدد delta، بعد لم إتمام reasoning بادئة وقت، إنتاج Client طي صار هذا. تحرير ترجمة بعد خاص مهايئ استدعاء `ClientAssistantStream.replace()`، لا زيادة منتج تصدير. ثلاثة عدد كل جديد صاف Node worker في حساب وقت قبل دمج صار ضيق تجميع أساس خط؛ استبدال وقت و قوي صنع GC بعد إبقاء كومة قسم آخر تنفيذ في موضع عدد ميزانية فحص. تحت واحد كثيف سري ترتيب رقم فوري frame ما زال يجب يتم قبول. معيار حمل إدارة CI استخدام 50 ms استبدال مسبق مدة و مشترك 1.25× بقية كمية (حد أعلى لـ 63 ms) ؛ إبقاء heap ميزانية ما زال لـ 30 MiB. فعلي قياس مثال هذا و دمج صار ارتداد مقابل وفق استخدام و worker حكم تحديد نفسه وقت تأكيد.

عبر `pnpm run build:bench` بناء، مجددا في `vitest.bench.config.ts` في اختيار `benchmarks/active-stream-reconnect`. هذا بند إبرة مقابل Node عمل سالب تحميل حيث لا بناء أيضا لا قياس كمية متصفح تصيير.[قبل طرف صفة قدرة ميزانية](../../.agents/notes/implemented/testing/2026-09-06-frontend-performance-budgets.ar.md) سجل تدقيق دقيق و ترتيب حذف بند.
