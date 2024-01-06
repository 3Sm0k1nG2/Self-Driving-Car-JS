class Controls {
    constructor() {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        const mapping = [
            {
                eventKeysLowerCased: ['w', 'arrowup'],
                controlKey: 'forward'
            },
            {
                eventKeysLowerCased: ['s', 'arrowdown'],
                controlKey: 'reverse'
            },
            {
                eventKeysLowerCased: ['a', 'arrowleft'],
                controlKey: 'left'
            },
            {
                eventKeysLowerCased: ['d', 'arrowright'],
                controlKey: 'right'
            },
        ]

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            const found = mapping.find(m => m.eventKeysLowerCased.includes(key));
            if(!found){
                return;
            }
            
            this[found.controlKey] = true;
        })

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            
            const found = mapping.find(m => m.eventKeysLowerCased.includes(key));
            if(!found){
                return;
            }
            
            this[found.controlKey] = false;
        })
    }
}

export default Controls;
