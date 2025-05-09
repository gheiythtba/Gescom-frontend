import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(31, 120, 255, 1), rgba(255, 255, 255, 0.8)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(255, 255, 255) 0%, rgb(23, 44, 80) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        > 
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight">
                    <span class="font-light block">Premium Quality</span>
                    Inventory Management System
                </h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
                    Streamline your business operations with our comprehensive solution.
                </p>
                <button 
                    pButton 
                    pRipple 
                    [rounded]="true" 
                    type="button" 
                    label="View More" 
                    severity="contrast"
                    class="!text-2xl mt-8 !px-8">
                </button>
            </div>
            <div class="flex justify-center md:justify-end">
                <img src="assets/Images/teest.png" alt="Inventory System Dashboard" class="w-9/12 md:w-auto max-h-[500px] object-contain" />
            </div>
        </div>
    `
})
export class HeroWidget {}