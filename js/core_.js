// thanks to http://gregfranko.com/jquery-best-practices/#/7

// IIFE - Immediately Invoked Function Expression
(function($, window, document) {


    var w               = $(window),
        htmlBody        = $('html, body'),
        navOrgY         = 86,
        nav             = $('.top-menu'),
        experienceList  = $('#section-experience article'),
        timeline        = $('.timeline-white-line'),
        timelineTimes   = $('.timeline-date'),
        timelinePeriods = $('.timeline-period'),
        experienceHelp  = $('.experience-help'),
        workDates       = $('.work-date'),
        topMenuLogo     = $('.top-menu-logo'),
        worksDetail     = $('#section-works-detail'),
        worksMenu       = $('.works-container').find('article'),

        i,
        timelienDatePercentages = [0.05, 0.27, 0.32, 0.39, 0.51, 0.68, 0.86, 0.96],
        timelinePeriodsPercentage = [[0.055, 0.275],[ 0.275,0.325],[0.39,0.515],[0.515,0.68],[0.68, 0.86],[0.86,0.965]],
        timelinePeriodsData = [],
        STATE_NORMAL    = "stateNormal",
        STATE_FIXED     = "stateFixed",
        currentTW,
        newTimelineX,
        newPeriodX,
        newPeriodW,
        navTimeout,
        anchorOffsetArray,
        currentTopMenuState







    // The $ is now locally scoped

    // Listen for the jQuery ready event on the document
    $(function() {


        w.resize(function() {
            experienceLayout();
            configTimelineUI();
            configWorkDetailUI();
        });
        w.on('scroll', function(event){
            configNavUI();
        })

        experienceLayout();
        configTimelineUI();
        fixWorkDates();
        configDataNavUI();
        configNavUI();
        configNavScroll();
        configWorksMenuUI();
        configWorkDetailListeners();

        worksDetail.hide();

    });
    function configWorkDetailListeners(){
        worksDetail.find('.works-detail-nav a').on('click', function(e){
            e.preventDefault();
            worksDetail.animate({left: w.width()}, 500, function(){
                $(this).hide();
                $(this).css('left', 0);
                htmlBody.css('overflow','auto');
            });

            worksDetail.fadeOut(500);
        })
    }
    function configWorksMenuUI(){
        worksMenu.css('cursor', 'pointer')
        worksMenu.on('click', function(e){
            htmlBody.css('overflow','hidden');
            worksDetail.css('left', w.width()).show();
            configWorkDetailUI($(this));
            worksDetail.animate({left: 0}, 500, function(){

            });

        })

        function configWorkDetailUI(article){
            if(!worksDetail.is(":visible")){
                return;
            }


            var config =                   {
                    detailGalleryPercent   : .4,
                    detailInfoPercentage   : .6
                },
                galleryContent          = $('.works-detail-gallery'),
                infoContent             = $('.works-detail-info'),
                galleryCarrousel        = $('.gallery-carrousel'),
                galleryMask             = $('.gallery-mask'),
                galleryNav              = $('.gallery-nav'),
                galleryH                = (currentHeight -  50) * config.detailGalleryPercent,
                infoH                   = (currentHeight -  50) * config.detailInfoPercentage,
                currentGalleryItem      = 0,
                currentHeight           = w.height() + 60,
                galleryNavSwipeIcon,
                i,
                imgW,
                imgH,
                numItems,
                imageScale,
                heightReference,
                dataWork,
                timeout;

            //reset gallery position
            worksDetail.css('width', w.width());
            worksDetail.css('height',currentHeight);
            galleryContent.css('height',galleryH);
            infoContent.css('height', infoH);
            galleryCarrousel.css('left',0);

            //update Content
            dataWork = {};
            dataWork.encabezado     =  article.find('.info-client').text();
            dataWork.info           =  article.find('.info-content').html();
            dataWork.team           =  article.find('.info-equipo').html();
            dataWork.gallery        = {}
            var imgRef              =  article.find('img');
            dataWork.gallery.folder     =  imgRef.data('folder');
            dataWork.gallery.base       =  imgRef.data('base');
            dataWork.gallery.number     =  parseInt(imgRef.data('number'));

            infoContent.find('.works-detail-info-columnA header h1').text(dataWork.encabezado)
            infoContent.find('.works-detail-info-columnA').find('p').remove();
            infoContent.find('.works-detail-info-columnA').append(dataWork.info);
            infoContent.find('aside').find('ul').remove();
            infoContent.find('aside').append(dataWork.team);


            //images
            var imgs = "";
            for(i = 0; i < dataWork.gallery.number; i++){
                 imgs += "<img class='galleryNode' src='img/gallery/"+dataWork.gallery.folder+"/" + (dataWork.gallery.base + (i + 1)) +".jpg'>";
            }
            galleryCarrousel.find('img').remove();
            //galleryCarrousel.hide();

            galleryCarrousel.append(imgs)
            numItems =  galleryCarrousel.find('img').length;

            //gallery Nav
            galleryNav.html('');
            //galleryNav.hide();
            for(i = 1; i <= numItems; i++){
                galleryNav.append('<div class="gallery-nav-button noSwipe"></div>')
            }
            galleryNav.append('<div class="gallery-nav-swipe-icon"></div>');
            galleryNavSwipeIcon     = $('.gallery-nav-swipe-icon');


            clearTimeout(timeout);
            timeout = setTimeout(galleryConfig, 1000);




            function galleryConfig(){
                clearTimeout(timeout);

                imgW = galleryCarrousel.find('img')[0].width;
                imgH = galleryCarrousel.find('img')[0].height;
                imageScale = galleryH / imgH;

                //galleryMask.width(imgW * imageScale);
                //galleryCarrousel.width((galleryMask.width() + 5) * numItems);
                galleryMask.width(200);
                galleryCarrousel.width(200)

                galleryNav.on('click', '.gallery-nav-button', function(e){
                    galleryNavSwipeIcon.fadeOut("fast", function(){
                        $(this).hide();
                    });
                    galleryNav.find('div').removeClass('gallery-nav-button-active');
                    $(this).addClass('gallery-nav-button-active');

                    galleryCarrousel.stop().animate({left: ($(this).index() * (imgW * imageScale)) * -1 }, 500, function(){

                    })
                })
                galleryNav.find('.gallery-nav-button').eq(0).addClass('gallery-nav-button-active');

                galleryNavFixUI();
                galleryConfigSwipeNav();

                //galleryNav.show();
                //galleryCarrousel.show();


            }

            function galleryNavFixUI(){
                heightReference = galleryMask.height();
                galleryNav.height(heightReference).
                    css('top', -1 * heightReference).
                    find('.gallery-nav-button').css('top', heightReference - 30);

                galleryNavSwipeIcon.css('top',heightReference - 60 - 110);
            }

            function galleryConfigSwipeNav(){
                galleryNav.swipe({
                    swipe:function(event, direction, distance, duration, fingerCount) {
                        //$(this).text("You swiped " + direction );
                        gallerySwipeMoveTo(direction)
                    }
                });
            }
            function gallerySwipeMoveTo(direction){
                switch (direction){
                    case "left":
                        currentGalleryItem++;
                        break;
                    case "right":
                        currentGalleryItem--;
                        break;
                }

                if(currentGalleryItem < 0){
                    currentGalleryItem = 0
                }
                if(currentGalleryItem >= numItems){
                    currentGalleryItem = numItems-1;
                }

                galleryNav.find('.gallery-nav-button').eq(currentGalleryItem).trigger('click')


            }
        }
    }



    function configNavScroll(){
        topMenuLogo.slideUp();
        nav.find('a[href^="#"]').on('click', function(e){
            //nav.find('a[href^="#"]').removeClass('top-menu-active');
            //$(this).addClass('top-menu-active');
             e.preventDefault();

             var target = this.hash,
                 $target = $(target);

            htmlBody.stop().animate({
                 'scrollTop': $target.offset().top - (navOrgY / 2)
             }, 700, 'linear', function () {
                 window.location.hash = target;
             });

         });
        $('.nav-to-top').on('click', function(e){
            e.preventDefault();
            animateScrollTop();
        });
        $('.top-menu-logo').on('click', function(e){
            e.preventDefault();
            animateScrollTop();
        });

    }
    function animateScrollTop(){
        htmlBody.stop().animate({
            'scrollTop': 0
        }, 700, 'linear', function () {
            window.location.hash = "";
        });
    }
    function configNavActiveButton(){
        var currentIndex;
        nav.find('a[href^="#"]').removeClass('top-menu-active');
        for(i = 0; i < anchorOffsetArray.length; i++){
            if(w.scrollTop() >= anchorOffsetArray[i]){
                currentIndex = i;
            }
        }
        nav.find('a[href^="#"]').eq(currentIndex).addClass('top-menu-active');

    }
    function configDataNavUI(){
        anchorOffsetArray = [];
        nav.find('a[href^="#"]').each(function(){
            $target = $(this.hash);
            anchorOffsetArray.push($target.offset().top - (navOrgY / 2));
        })
        //console.log(anchorOffsetArray);
    }
    function configNavUI(){
        if(w.scrollTop() > (navOrgY + 50)){
            topMenuLogo.removeClass('hidden').slideDown();
            setPositionNav(STATE_FIXED)
        }else{
            topMenuLogo.slideUp().addClass('hidden');
            setPositionNav(STATE_NORMAL);
        }

        configNavActiveButton();
    }
    function setPositionNav(value){
        if(currentTopMenuState == value){
            return;
        }
        switch (value){
            case STATE_FIXED:
                nav.addClass('custom-top-menu').slideUp(0);
                nav.slideDown();
                break;
            case STATE_NORMAL:
                nav.removeClass('custom-top-menu')
                break;
        }
        currentTopMenuState = value;

    }

    function fixWorkDates(){
        workDates.append( "&nbsp;" );
    }
    function experienceLayout(){
        experienceList
            .off('mouseenter')
            .off('mouseleave');

        if($(window).width() < 830){
            $('#section-experience article .experience-tool-tip').fadeIn(1);
        }else{
            $('#section-experience article .experience-tool-tip').hide();
            //  timelinePeriods.hide();
            experienceList
                .on('mouseenter', function(event){
                    experienceHelp.stop().fadeOut();
                    experienceList.find('.experience-tool-tip').stop().hide();
                    $(this).find('.experience-tool-tip').fadeIn();
                    var currentIndex = experienceList.index($(this));
                    timelinePeriods.stop().animate({width:timelinePeriodsData[currentIndex][1], left:timelinePeriodsData[currentIndex][0]}, 500)
                })
                .on('mouseleave', function(event){
                    timelinePeriods.stop().animate({width:10, left:0}, 500)
                    experienceHelp.fadeIn();
                    experienceList.find('.experience-tool-tip').stop().hide();
                })
        }
    }
    function configTimelineUI(){
        timelinePeriodsData = [];
        currentTW =  timeline.width();

        for(i = 0 ; i < timelineTimes.length; i++){
            newTimelineX =   currentTW *  timelienDatePercentages[i] - 18;
            //timelineTimes.eq(i).remove().css('left', newTimelineX).append();
            timelineTimes.eq(i).css('left', newTimelineX);
        }
        for(i = 0 ; i < timelinePeriodsPercentage.length; i++){
            newPeriodX = currentTW * timelinePeriodsPercentage[i][0];
            newPeriodW = currentTW * (timelinePeriodsPercentage[i][1] - timelinePeriodsPercentage[i][0]);
            timelinePeriodsData.push([newPeriodX, newPeriodW])
        }

    }


}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter
