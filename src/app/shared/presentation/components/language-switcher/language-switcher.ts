import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  protected currentLanguage: string = 'es';
  protected languages = ['es', 'en'];

  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.currentLanguage = this.translate.currentLang || this.translate.defaultLang || 'es';
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLanguage = lang;
  }
}
