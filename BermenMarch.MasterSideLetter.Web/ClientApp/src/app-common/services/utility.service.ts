import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class UtilityService {

    convertLocalTimeZone(dateInput) {
        // CST - UTC offset: 6 hours
        var serverOffset = 360,
            clientOffset = new Date().getTimezoneOffset() / 60,
            serverDate = new Date(dateInput),
            utc = serverDate.getTime() + (360 * 60000),
            clientDate = new Date(utc - (3600000 * clientOffset));

        return clientDate;
    }

    formatDate(date: string) {
        if (date) {
            let d = new Date(new Date(this.convertLocalTimeZone(date)).toLocaleString('en-US', { timeZone: 'America/Chicago' }));
            let dateStamp = +d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
            let monthStamp = +(d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);

            return '<div title="' + new Date(date) + '">' + monthStamp + '/' + dateStamp + '/' + + d.getFullYear() + '</div>';
        }

        return '';
    }

    formatDateTime(date: string) {
        if (date) {

            let d = new Date(new Date(date).toLocaleString('en-US', { timeZone: 'America/Chicago' }));
            let dateStamp = +d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
            let monthStamp = +(d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);

            let localeSpecificTime = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            return '<div title="' + new Date(date) + '">' + monthStamp + '/' + dateStamp + '/' + d.getFullYear() +
                '<span class="pl-1" >' + localeSpecificTime + '</span>' +
                '</div>';
        }

        return '';
    }

  
}
