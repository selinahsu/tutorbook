import {
    MDCRipple
} from '@material/ripple/index';
import {
    MDCTopAppBar
} from '@material/top-app-bar/index';

import $ from 'jquery';

const NewRequestDialog = require('dialogs').newRequest;
const PaidRequestDialog = require('dialogs').paidRequest;
const StripeRequestDialog = require('dialogs').stripeRequest;
const Utils = require('utils');
const Data = require('data');

// Class that creates it's view when called (such that mains are always
// ready to go).
class User {

    constructor(profile) {
        this.render = app.render;
        profile.availableTimes = Utils
            .getAvailabilityStrings(profile.availability);
        if (profile.payments.type === 'Paid') {
            profile.paid = true;
            profile.showAbout = true;
            profile.showLocation = true;
        } else {
            profile.free = true;
        }
        this.profile = profile;
        this.renderSelf();
    }

    static async viewUser(id) {
        const users = window.app.search.users;
        if (!users[id]) {
            const p = await Data.getUser(id);
            users[id] = new User(p);
        }
        return users[id].view();
    }

    renderSelf() {
        this.main = this.render.template('user-view',
            Utils.combineMaps(this.profile, {
                rate: '$' + this.profile.payments.hourlyCharge
            })
        );

        if (this.profile.payments.type === 'Paid') {
            const first =
                (Object.entries(this.profile.availability).length > 0) ?
                Object.entries(this.profile.availability)[0][0] :
                window.app.location.name;
            if (Data.locations.indexOf(first) >= 0) {
                var addr = Data.addresses[first];
            } else {
                var addr = first;
            }
            new google.maps.Geocoder().geocode({
                address: addr,
            }, (res, status) => {
                if (status === 'OK') {
                    const geo = res[0].geometry.location;
                    var latLang = {
                        lat: geo.lat(),
                        lng: geo.lng(),
                    };
                } else { // Gunn Academic Center
                    var latLang = {
                        lat: 37.400222,
                        lng: -122.132488
                    };
                }
                const map = new google.maps.Map($(this.main).find('#map')[0], {
                    zoom: 15,
                    center: latLang,
                }); // TODO: Add markers for all the user's locations
                const marker = new google.maps.Marker({
                    position: latLang,
                    map: map,
                    title: 'Tutors Here',
                });
            });
        }

        this.header = this.render.header('header-back', {
            title: 'View User',
            showEdit: (window.app.user.type === 'Supervisor' &&
                this.profile.payments.type === 'Free'),
            edit: () => {
                new window.app.EditProfile(this.profile).view();
            },
            showMatch: (window.app.user.type === 'Supervisor' &&
                this.profile.payments.type === 'Free'),
            match: () => {
                Data.updateUser(Utils.combineMaps(this.profile, {
                    proxy: [window.app.user.email],
                }));
                new window.app.MatchingDialog(this.profile).view();
            },

        });
    }

    view() {
        app.intercom.view(false);
        app.view(
            this.header,
            this.main,
            '/app/users/' + this.profile.uid
        );
        this.manage();
    }

    reView() {
        if (window.app.user.type === 'Supervisor')
            $(this.header).find('#edit').click(() => {
                new window.app.EditProfile(this.profile).view();
            }); // TODO: Why do the header click listeners go away but others don't?
    }

    manage() {
        // SUBJECTS
        this.main.querySelectorAll('#subjects .mdc-list-item').forEach((el) => {
            MDCRipple.attachTo(el);
            el.addEventListener('click', () => {
                if (this.profile.payments.type === 'Paid') {
                    return new StripeRequestDialog(el.innerText, this.profile).view();
                }
                return new NewRequestDialog(el.innerText, this.profile).view();
            });
        });

        // MESSAGE FAB
        const messageFab = this.main.querySelector('#message-button');
        MDCRipple.attachTo(messageFab);
        messageFab.addEventListener('click', () => {
            return window.app.chats.newWith(this.profile);
        });

        // REQUEST FAB
        const requestFab = this.main.querySelector('#request-button');
        MDCRipple.attachTo(requestFab);
        requestFab.addEventListener('click', () => {
            if (this.profile.payments.type === 'Paid') {
                return new StripeRequestDialog('', this.profile).view();
            }
            return new NewRequestDialog('', this.profile).view();
        });

        // HEADER
        MDCTopAppBar.attachTo(this.header);
    }

};

module.exports = User;