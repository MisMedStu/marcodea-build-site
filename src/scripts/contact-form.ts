/**
 * نموذج الحجز: تحقّق في المتصفح ثم فتح واتساب برسالة منسّقة.
 * لا خادم ولا قاعدة بيانات — الطلب يصل عبر واتساب مباشرة.
 */

interface FormConfig {
  whatsapp: string;
  errors: {
    nameRequired: string;
    nameTooShort: string;
    phoneRequired: string;
    phoneFormat: string;
    areaFormat: string;
  };
  heading: string;
  labels: {
    name: string;
    phone: string;
    type: string;
    area: string;
    service: string;
    note: string;
  };
  areaUnit: string;
}

/** يحوّل الأرقام العربية والهندية إلى لاتينية ويحذف الفراغات والرموز */
function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s\-()+]/g, '');
}

function setError(input: HTMLInputElement, box: HTMLElement | null, message: string): void {
  if (box) box.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

export function initContactForm(): void {
  const form = document.getElementById('leadForm') as HTMLFormElement | null;
  const configEl = document.getElementById('form-config');
  if (!form || !configEl?.textContent) return;

  const config = JSON.parse(configEl.textContent) as FormConfig;

  const nameInput = document.getElementById('f-name') as HTMLInputElement;
  const phoneInput = document.getElementById('f-phone') as HTMLInputElement;
  const areaInput = document.getElementById('f-area') as HTMLInputElement;
  const typeInput = document.getElementById('f-type') as HTMLSelectElement;
  const serviceInput = document.getElementById('f-svc') as HTMLSelectElement;
  const noteInput = document.getElementById('f-note') as HTMLTextAreaElement;
  const toast = document.getElementById('toast');

  const errName = document.getElementById('e-name');
  const errPhone = document.getElementById('e-phone');
  const errArea = document.getElementById('e-area');

  function validate(): boolean {
    let firstInvalid: HTMLInputElement | null = null;

    const name = nameInput.value.trim();
    if (!name) {
      setError(nameInput, errName, config.errors.nameRequired);
      firstInvalid = nameInput;
    } else if (name.length < 3) {
      setError(nameInput, errName, config.errors.nameTooShort);
      firstInvalid = nameInput;
    } else {
      setError(nameInput, errName, '');
    }

    const phone = normalizeDigits(phoneInput.value);
    if (!phone) {
      setError(phoneInput, errPhone, config.errors.phoneRequired);
      firstInvalid ??= phoneInput;
    } else if (!/^09\d{8}$/.test(phone)) {
      setError(phoneInput, errPhone, config.errors.phoneFormat);
      firstInvalid ??= phoneInput;
    } else {
      setError(phoneInput, errPhone, '');
    }

    const area = normalizeDigits(areaInput.value);
    if (area && !/^\d{1,6}$/.test(area)) {
      setError(areaInput, errArea, config.errors.areaFormat);
      firstInvalid ??= areaInput;
    } else {
      setError(areaInput, errArea, '');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function buildMessage(): string {
    const area = normalizeDigits(areaInput.value);
    const note = noteInput.value.trim();
    const lines = [
      config.heading,
      '',
      `${config.labels.name}: ${nameInput.value.trim()}`,
      `${config.labels.phone}: ${normalizeDigits(phoneInput.value)}`,
      `${config.labels.type}: ${typeInput.value}`,
    ];

    if (area) lines.push(`${config.labels.area}: ${area} ${config.areaUnit}`);
    lines.push(`${config.labels.service}: ${serviceInput.value}`);
    if (note) lines.push(`${config.labels.note}: ${note}`);

    return lines.join('\n');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;

    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank', 'noopener');

    if (toast) {
      toast.hidden = false;
      toast.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });

  // إخفاء رسالة الخطأ فور تصحيح الحقل
  for (const [input, box] of [
    [nameInput, errName],
    [phoneInput, errPhone],
    [areaInput, errArea],
  ] as const) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, box, '');
    });
  }
}
