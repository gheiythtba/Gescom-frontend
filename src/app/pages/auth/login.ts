import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, IconFieldModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
    template: `
    <div class="flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
         style="background: linear-gradient(to top right, #1F78FF 0%, #151924 62%, #151924 100%);">
                <div class="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                    <img src="assets/Images/logowhite.png" alt="Site Logo" class="h-20 md:h-24">
                </div>
        <!-- Welcome Section -->
        <div class="hidden md:flex flex-col items-center justify-center mt-10">
            <div style="border-radius: 56px; padding: 0.3rem;">
                <div class="w-full py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center ">
                        <div class="text-white text-7xl font-black mb-6">Welcome Back</div>
                        <span class="text-white text-xl font-base">
                            Login To continue yourourney with <br> GESCOM
                        </span>
                        <div>
                            <div class="text-white text-xl mb-4 mt-20">Don't have an account ?</div>
                            <a href="mailto:tbagheiyth@gmail.com?subject=Account%20Request&body=Hello%20Admin%2C%0A%0AI%20would%20like%20to%20request%20an%20account%20for%20GESCOM.%0A%0ABest%20regards%2C" 
   class="no-underline">
                            <p-button 
                                label="Contact Admin" 
                                styleClass="w-[350px]"
                                rounded
                                [style]="{ 
                                    'background-color': 'white', 
                                    'color': '#1F78FF',
                                    'border': 'none'
                                }"
                                class="!text-3xl hover:opacity-90 transition-opacity" 
                                >
                                </p-button>
                            </a>sss
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
        <!-- Login Form Section -->
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem;">
                <div class="w-full py-20 px-8 sm:px-20">
                    <div class="text-center mb-8">
                        <div class="text-[#1F78FF] text-7xl font-black mb-4">Sign in</div> 
                    </div>
                    
                    <div class="w-full max-w-[500px] mx-auto">
                        <!-- Email Input -->
                            <div class="mb-6">
                            <label for="email1" class="block text-white text-xl font-light mb-1">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" 
                                    class="w-full !h-14 !w-[400px] !text-lg !bg-transparent !border-1 !border-white !text-white placeholder:text-gray-300" [(ngModel)]="email" />
                            </div>
                            <!-- Password Input -->
                            <div class="mb-6">
                                <label for="password1" class="block text-white font-light text-xl mb-1">Password</label>
                                <p-password id="password1" [(ngModel)]="password" placeholder="Password" 
                                            [toggleMask]="true" [feedback]="false" 
                                            inputStyleClass="w-full !h-14 !w-[400px]  !text-lg !bg-transparent !border-1 !border-white !text-white placeholder:text-gray-300"></p-password>
                            </div>

                        <!-- Remember Me & Forgot Password -->
                        <div class="flex items-center justify-between mb-8">
                            <div class="flex items-center">
                                <p-checkbox [(ngModel)]="checked" id="rememberme1" binary 
                                           class="mr-2"></p-checkbox>
                                <label for="rememberme1" class="text-white">Remember me</label>
                            </div>
                            <span class="font-medium no-underline cursor-pointer text-white"> Need Help ?</span>
                        </div>
                        
                        <!-- Sign In Button -->
                       
                                <p-button 
                                label="Sign In" 
                                styleClass="w-full" rounded
                                [style]="{ 
                                    'background-color': '#1F78FF', 
                                    'color': 'white',
                                    'border': 'none'
                                }"
                                class="!text-3xl hover:opacity-90 transition-opacity" 
                                routerLink="/">
                                </p-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
}