import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class BuzzerHammerConfig extends HammerGestureConfig {
    override overrides = {
        press: {
            time: 100,
            threshold: 50,
        },
        pressup: {
            threshold: 200,
        }
    };
}