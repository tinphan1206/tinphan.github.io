let draggable = ({pageX, pageY}, items) => {
    let dragItems = Array.isArray(items) ? items : [items];
    let drag = {x: pageX, y: pageY};

    let dragMove = ({pageX, pageY}) => {
        dragItems.forEach(item => {
            item.pos.x -= drag.x - pageX;
            item.pos.y -= drag.y - pageY;
        });

        drag = {x: pageX, y: pageY};
    };

    let dragEnd = () => {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    };

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
};