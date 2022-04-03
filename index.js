function ScheduleTemplate(element) {
    this.element = element;
    this.timelineItems = this.element.getElementsByClassName('cd-schedule__timeline')[0].getElementsByTagName('li');

    this.singleEvents = this.element.getElementsByClassName('cd-schedule__event');

    this.initSchedule();
};

ScheduleTemplate.prototype.initSchedule = function() {
    this.scheduleReset();
    this.initEvents();
};
ScheduleTemplate.prototype.placeEvents = function() {

    var self = this,
        slotHeight = this.topInfoElement.offsetHeight;
    for (var i = 0; i < this.singleEvents.length; i++) {
        var anchor = this.singleEvents[i].getElementsByTagName('a')[0];
        var start = getScheduleTimestamp(anchor.getAttribute('data-start')),
            duration = getScheduleTimestamp(anchor.getAttribute('data-end')) - start;

        var eventTop = slotHeight * (start - self.timelineStart) / self.timelineUnitDuration,
            eventHeight = slotHeight * duration / self.timelineUnitDuration;

        this.singleEvents[i].setAttribute('style', 'top: ' + (eventTop - 1) + 'px; height: ' + (eventHeight + 1) + 'px');
    }
};
ScheduleTemplate.prototype.openModal = function(target) {
    var self = this;
    var mq = self.mq();
    this.animating = true;


    this.modalEventName.textContent = target.getElementsByTagName('em')[0].textContent;
    this.modalDate.textContent = target.getAttribute('data-start') + ' - ' + target.getAttribute('data-end');
    this.modal.setAttribute('data-event', target.getAttribute('data-event'));


    this.loadEventContent(target.getAttribute('data-content'));

    Util.addClass(this.modal, 'cd-schedule-modal--open');

    if (mq == 'mobile') {
        self.modal.addEventListener('transitionend', function cb() {
            self.animating = false;
            self.modal.removeEventListener('transitionend', cb);
        });
    } else {
        var eventPosition = target.getBoundingClientRect(),
            eventTop = eventPosition.top,
            eventLeft = eventPosition.left,
            eventHeight = target.offsetHeight,
            eventWidth = target.offsetWidth;

        var windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;

        var modalWidth = (windowWidth * .8 > self.modalMaxWidth) ? self.modalMaxWidth : windowWidth * .8,
            modalHeight = (windowHeight * .8 > self.modalMaxHeight) ? self.modalMaxHeight : windowHeight * .8;

        var modalTranslateX = parseInt((windowWidth - modalWidth) / 2 - eventLeft),
            modalTranslateY = parseInt((windowHeight - modalHeight) / 2 - eventTop);

        var HeaderBgScaleY = modalHeight / eventHeight,
            BodyBgScaleX = (modalWidth - eventWidth);


        self.modal.setAttribute('style', 'top:' + eventTop + 'px;left:' + eventLeft + 'px;height:' + modalHeight + 'px;width:' + modalWidth + 'px;transform: translateY(' + modalTranslateY + 'px) translateX(' + modalTranslateX + 'px)');

        self.modalHeader.setAttribute('style', 'width:' + eventWidth + 'px');

        self.modalBody.setAttribute('style', 'margin-left:' + eventWidth + 'px');

        self.modalBodyBg.setAttribute('style', 'height:' + eventHeight + 'px; width: 1px; transform: scaleY(' + HeaderBgScaleY + ') scaleX(' + BodyBgScaleX + ')');

        self.modalHeaderBg.setAttribute('style', 'height: ' + eventHeight + 'px; width: ' + eventWidth + 'px; transform: scaleY(' + HeaderBgScaleY + ')');

        self.modalHeaderBg.addEventListener('transitionend', function cb() {

            self.animating = false;

            self.modalHeaderBg.removeEventListener('transitionend', cb);
        });
    }
};
