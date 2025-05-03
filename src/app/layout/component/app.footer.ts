import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Gescom by
        <a href="https://www.linkedin.com/in/gheiythabarki/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Gheiyth</a>
    </div>`
})
export class AppFooter {}
