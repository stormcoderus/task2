/*! Coordinates and Time - v0.0.1 - 2016-04-01
* Copyright (c) 2016 Ruslan Usmanov; */
/* 
Необходимо написать плагин для  jQuery, который каждые 30 мс 
собирает данные о положении курсора мыши на странице
и времени, а затем отправляет их на сервер. Данные должны представлять 
массив объектов с координатами точек и времени,
которое курсор провел в них. Серверную часть реализовывать не надо.
Плагин должен принимать следующие настройки:
• checkInterval  - период сбора данных (по умолчанию 30мс)
• sendInterval – период отправки данных на сервер (по умолчанию 3с)
• url – адрес, на который будут отправляться данные 
Плагин должен вызываться как метод некоторого jQuery-объекта, и координаты мыши д
олжны рассчитываться относительно
 координат этого объекта. Пример вызова плагина:
$(“div.container”).trackCoords({url: ‘/save.php’});
*/
(function( $ ){

    $.fn.trackCoords = function( options ) {  

        var $this = $(this);

        var coordinates = {
            xPosition : 0,
            yPosition : 0,
            time      : 0,
        };

        // Создаём настройки по-умолчанию, расширяя их с помощью параметров, которые были переданы
        var settings = $.extend( {
            'url'           : '',
            'checkInterval' : '30',
            'sendInterval'  : '3000',
        }, options);

        var getMousePosition = function() {
            $( document ).on("mousemove", function( event ) {
                // getting mouse coordinates
                coordinates.xPosition = event.pageX - $this.offset().left;
                coordinates.yPosition = event.pageY - $this.offset().top;
                // start mouse standing time
                var time = Date.now();
                coordinates.time = time;
            });
        };

        var sendData = function() {
            setInterval(function() {
                $.ajax({
                    type: 'POST',
                    url: settings.url,
                    data: {coordinates : coordinates},
                        success: function(data) {
                            console.log('ajax success! data = '+data);
                        },
                        error:  function(xhr, str){
                            alert('Возникла ошибка: ' + xhr.responseCode+ str);
                        }
                });
            }, settings.sendInterval);
        }

        return this.each(function() {

            setInterval(function() {
                getMousePosition();
                // getting mouse standing time
                var time = Date.now();
                coordinates.time = time - coordinates.time;
            }, settings.checkInterval);

            sendData();
        });

    };
})( jQuery );
