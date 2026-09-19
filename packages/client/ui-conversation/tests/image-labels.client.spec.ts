import { describe, expect, it } from 'vitest'
import { makeTranslate } from '@deepseek-ai/dsh-client-test-runtime'
import { zh as commonZh } from '@deepseek-ai/dsh-client-locale/src/locales/zh.ts'
import { attachmentErrorText, imageSizeText } from '../src/client/image-labels.ts'
import { en, zh } from '../src/client/locales.ts'

const t = makeTranslate(zh, commonZh)
const enT = makeTranslate(en, commonZh)

describe('attachment rejection copy', () => {
  const limits = {
    maxImageBytes: 5 * 1024 * 1024,
    maxImagesPerMessage: 20,
    maxMessageImageBytes: 100 * 1024 * 1024,
    maxImagePixels: 40_000_000,
    maxImageDimension: 2000,
    mediaTypes: ['image/png'] as const,
  }

  it('renders megabytes without a trailing fraction unless one exists', () => {
    expect(imageSizeText(10 * 1024 * 1024)).toBe('10MB')
    expect(imageSizeText(2.5 * 1024 * 1024)).toBe('2.5MB')
  })

  it('maps user-solvable reasons to limit-naming copy', () => {
    expect(attachmentErrorText(t, 'MODEL_DOES_NOT_SUPPORT_IMAGES')).toBe('حالي نموذج لا دعم حمل صورة، طلب تبديل دعم حمل صورة نموذج')
    expect(attachmentErrorText(t, 'IMAGE_TOO_MANY_PIXELS')).toBe('صورة قسم تمييز معدل مرور كبير، طلب ضغط بعد إعادة محاولة')
    expect(attachmentErrorText(t, 'INVALID_IMAGE')).toBe('فقط دعم حمل PNG،JPG،WebP،GIF صيغة صورة')
    expect(attachmentErrorText(t, 'IMAGE_TYPE_MISMATCH')).toBe('فقط دعم حمل PNG،JPG،WebP،GIF صيغة صورة')
    expect(attachmentErrorText(t, 'TOO_MANY_IMAGES', limits)).toBe('واحد بند رسالة الأكثر كثير إضافة 20 ورقة صورة')
    expect(attachmentErrorText(t, 'IMAGE_TOO_LARGE', limits)).toBe('مفرد ورقة صورة لا يستطيع تجاوز مرور 5MB')
    expect(attachmentErrorText(t, 'IMAGES_TOO_LARGE', limits)).toBe('صورة مجموع كبير صغير تجاوز مرور 100MB، طلب إزالة جزء صورة')
    expect(attachmentErrorText(t, 'IMAGE_DIMENSION_TOO_LARGE', limits)).toBe('صورة عرض عال لا يستطيع تجاوز مرور 2000px، طلب تقليص صغير بعد إعادة محاولة')
    expect(attachmentErrorText(enT, 'TOO_MANY_IMAGES', limits)).toBe('A message can include up to 20 images')
  })

  it('folds unknown reasons and limit reasons without projected limits into the send-failed line', () => {
    expect(attachmentErrorText(t, 'INVALID_IMAGE_BASE64')).toBe('صورة إرسال فشل (INVALID_IMAGE_BASE64) ، طلب إعادة إضافة صورة بعد مجددا تجربة')
    expect(attachmentErrorText(t, 'TOO_MANY_IMAGES')).toBe('صورة إرسال فشل (TOO_MANY_IMAGES) ، طلب إعادة إضافة صورة بعد مجددا تجربة')
    expect(attachmentErrorText(t, 'IMAGE_TOO_LARGE')).toBe('صورة إرسال فشل (IMAGE_TOO_LARGE) ، طلب إعادة إضافة صورة بعد مجددا تجربة')
    expect(attachmentErrorText(t, 'IMAGES_TOO_LARGE')).toBe('صورة إرسال فشل (IMAGES_TOO_LARGE) ، طلب إعادة إضافة صورة بعد مجددا تجربة')
    expect(attachmentErrorText(t, 'IMAGE_DIMENSION_TOO_LARGE')).toBe('صورة إرسال فشل (IMAGE_DIMENSION_TOO_LARGE) ، طلب إعادة إضافة صورة بعد مجددا تجربة')
  })
})
