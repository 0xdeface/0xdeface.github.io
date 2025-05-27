let devices = [];
let currentPort = null;
let devicesMap = {};
let lastClickedPort = null;

// Элементы управления
const configTextarea = document.getElementById('config-textarea');
const loadBtn = document.getElementById('load-btn');
const exportBtn = document.getElementById('export-btn');
const addDeviceBtn = document.getElementById('add-device-btn');
const clearBtn = document.getElementById('clear-btn');
const addDeviceModal = document.getElementById('add-device-modal');
const editPortModal = document.getElementById('edit-port-modal');
const saveDeviceBtn = document.getElementById('save-device-btn');
const cancelDeviceBtn = document.getElementById('cancel-device-btn');
const savePortBtn = document.getElementById('save-port-btn');
const cancelPortBtn = document.getElementById('cancel-port-btn');
const deviceNameInput = document.getElementById('device-name');
const portTypeInput = document.getElementById('port-type');
const portCountInput = document.getElementById('port-count');
const startPortInput = document.getElementById('start-port');
const editPortNameInput = document.getElementById('edit-port-name');
const editVlanInput = document.getElementById('edit-vlan');
const editDstInput = document.getElementById('edit-dst');
const contextMenu = document.getElementById('context-menu');
const rack = document.getElementById('rack')

function initialize(devices) {
// Инициализация приложения
    function init() {
        // Загрузка тестовых данных
        renderRack();
        updateConfigTextarea();

        // Назначение обработчиков событий
        loadBtn.addEventListener('click', loadConfig);
        exportBtn.addEventListener('click', exportConfig);
        addDeviceBtn.addEventListener('click', () => {
            deviceNameInput.value = '';
            portCountInput.value = 8;
            startPortInput.value = 1;
            addDeviceModal.style.display = 'flex';
        });
        clearBtn.addEventListener('click', clearAll);
        saveDeviceBtn.addEventListener('click', saveNewDevice);
        cancelDeviceBtn.addEventListener('click', () => addDeviceModal.style.display = 'none');
        savePortBtn.addEventListener('click', savePortConfig);
        cancelPortBtn.addEventListener('click', () => editPortModal.style.display = 'none');

        // Закрытие контекстного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (e.target !== contextMenu && !contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });

        // Инициализация SVG для кабелей
        updateSvgPosition();
        window.addEventListener('scroll', updateSvgPosition);
        window.addEventListener('resize', updateSvgPosition);
        rack.addEventListener('dragend', (event) => {
            let dragDevice = event.target;
            let dragTargetY = event.clientY;
            let dstDevice = null;
            document.querySelectorAll('.device').forEach(el => {
                let deviceTop = el.getBoundingClientRect().top;
                if (dragTargetY > deviceTop) {
                    dstDevice = el.dataset.deviceName;
                }
            })
            if (dstDevice != null) {
                moveAfter(dragDevice.dataset.deviceName, dstDevice)
                renderRack()
            }
        })
    }

    function moveAfter(srcDeviceName, dstDeviceName) {
        let src = devices.findIndex(s => s.name === srcDeviceName)
        let dst = devices.findIndex(s => s.name === dstDeviceName)
        let element = devices[src];
        devices.splice(src, 1);
        devices.splice(dst, 0, element);
    }

// Обновление позиции SVG при скролле/ресайзе
    function updateSvgPosition() {
        const svg = document.getElementById('cables-svg');
        const rack = document.querySelector('.cable-offset');
        const rect = rack.getBoundingClientRect();

        svg.style.top = `${rect.top + window.scrollY}px`;
        svg.style.left = `${rect.left + window.scrollX}px`;
        svg.style.width = `${rect.width}px`;
        svg.style.height = `${rect.height}px`;
    }

// Отрисовка стойки с устройствами
    function renderRack() {
        const rack = document.getElementById('rack');
        const connectionInfo = document.getElementById('connection-info');
        const svg = document.getElementById('cables-svg');

        // Очищаем стойку
        rack.innerHTML = '';
        connectionInfo.innerHTML = '';
        svg.innerHTML = '';
        connectionInfo.style.display = 'none';

        // Сбрасываем выделение
        lastClickedPort = null;

        // Создаем карту устройств
        devicesMap = {};
        const externalSystems = new Set();

        devices.forEach(device => {
            devicesMap[device.name] = device;
        });

        // Отрисовываем устройства
        devices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = 'device';
            deviceElement.draggable = true;
            deviceElement.dataset.deviceName = device.name;
            // deviceElement.addEventListener('drag', (e) => {
            //     console.log('dr')
            //     console.log(e)
            //     console.log('ag')
            // })
            // deviceElement.addEventListener('dragstart', (e) =>{
            //     console.log('dragstart')
            //     console.log(e)
            // })
            // deviceElement.addEventListener('dragend', (e) => {
            //     console.log('dragend')
            //     console.log(e)
            // })
            const nameElement = document.createElement('div');
            nameElement.className = 'device-name';
            nameElement.textContent = device.name;

            // Обработчик правой кнопки мыши на устройство
            nameElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showDeviceContextMenu(e, device);
            });

            deviceElement.appendChild(nameElement);

            const portsContainer = document.createElement('div');
            portsContainer.className = 'ports-container';

            // Отрисовываем порты
            Object.entries(device.ports).forEach(([portName, portData]) => {
                const portElement = document.createElement('div');
                portElement.className = 'port';
                portElement.textContent = portName;
                portElement.dataset.device = device.name;
                portElement.dataset.port = portName;

                if (Object.keys(portData).length === 0) {
                    portElement.classList.add('unplugged');
                    portElement.title = 'Не подключен';
                } else {
                    // Проверяем, является ли подключение внешней системой
                    const isExternal = portData.dst && !devicesMap[portData.dst];

                    if (isExternal) {
                        portElement.classList.add('external');
                        externalSystems.add(portData.dst);
                    } else {
                        portElement.classList.add('connected');
                    }

                    // Добавляем информацию о VLAN в title
                    if (portData.vlan) {
                        portElement.title = `VLAN: ${portData.vlan.join(', ')}`;
                        if (isExternal && portData.dst) {
                            portElement.title = `${portData.dst} (VLAN: ${portData.vlan.join(', ')})`;
                        }
                    }
                }

                // Обработчик левой кнопки мыши на порт
                portElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePortClick(device.name, portName, portData, e);
                });

                // Обработчик правой кнопки мыши на порт
                portElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showPortContextMenu(e, device.name, portName, portData);
                });

                portsContainer.appendChild(portElement);
            });

            deviceElement.appendChild(portsContainer);
            rack.appendChild(deviceElement);
        });

        // Отрисовываем блок внешних систем
        if (externalSystems.size > 0) {
            const externalContainer = document.createElement('div');
            externalContainer.className = 'external-systems';
            externalContainer.innerHTML = '<h3>Внешние системы:</h3>';

            Array.from(externalSystems).forEach(sys => {
                const sysElement = document.createElement('span');
                sysElement.className = 'external-system';
                sysElement.textContent = sys;
                externalContainer.appendChild(sysElement);
            });

            rack.appendChild(externalContainer);
        }
    }

    function drawCable(sourcePort, targetPort) {
        const svg = document.getElementById('cables-svg');
        const rackRect = document.querySelector('.rack').getBoundingClientRect();
        console.log(sourcePort)
        // Координаты относительно rack с точным позиционированием
        const sourceX = sourcePort.rect.left - rackRect.left + sourcePort.rect.width / 2;
        const sourceY = sourcePort.rect.bottom - rackRect.top - sourcePort.rect.height / 2;
        const targetX = targetPort.rect.left - rackRect.left + targetPort.rect.width / 2;
        let tY = targetPort.rect.top - rackRect.top - targetPort.rect.height;
        if (targetPort.rect.top < sourcePort.rect.top) {
            console.log('t<s')
            tY = targetPort.rect.bottom - rackRect.top - targetPort.rect.height / 2;
        }

        const targetY = tY;

        // Вертикальный отступ от портов (5px для точного касания)
        const verticalOffset = 10;
        // Создаем путь кабеля с прямыми углами и точным позиционированием
        const cable = document.createElementNS("http://www.w3.org/2000/svg", "path");
        console.log(targetPort)
        let pathData;
        if (sourceX < targetX) {
            // Соединение слева направо
            pathData = `
                    M${sourceX},${sourceY}
                    L${sourceX},${sourceY + verticalOffset}
                    L${targetX},${sourceY + verticalOffset}
                    L${targetX},${targetY}
                `;
        } else {
            // Соединение справа налево
            pathData = `
                    M${sourceX},${sourceY}
                    L${sourceX},${sourceY + verticalOffset}
                    L${targetX},${sourceY + verticalOffset}
                    L${targetX},${targetY}
                `;
        }

        cable.setAttribute("d", pathData.trim().replace(/\s+/g, ' '));
        cable.setAttribute("class", "cable-path");
        svg.appendChild(cable);
    }

    function updateSvgPosition() {
        const svg = document.getElementById('cables-svg');
        const rack = document.querySelector('.rack');
        const rect = rack.getBoundingClientRect();

        svg.style.top = `${rect.top + window.scrollY}px`;
        svg.style.left = `${rect.left + window.scrollX}px`;
        svg.style.width = `${rect.width}px`;
        svg.style.height = `${rect.height}px`;
    }


    function handlePortClick(deviceName, portName, portData, e) {
        const portElement = e.target;
        const svg = document.getElementById('cables-svg');

        // Очищаем предыдущие кабели
        svg.innerHTML = '';

        // Снимаем выделение со всех портов
        document.querySelectorAll('.port').forEach(p => p.classList.remove('active'));

        // Подсвечиваем текущий порт
        portElement.classList.add('active');

        // Если порт подключен к другому порту - рисуем кабель
        if (portData.dst && portData.dstPort) {
            const targetDevice = devicesMap[portData.dst];
            if (targetDevice) {
                const targetPortElement = document.querySelector(
                    `.port[data-device="${portData.dst}"][data-port="${portData.dstPort}"]`
                );

                if (targetPortElement) {
                    // Подсвечиваем целевой порт
                    targetPortElement.classList.add('active');

                    // Получаем координаты портов
                    const sourceRect = portElement.getBoundingClientRect();
                    const targetRect = targetPortElement.getBoundingClientRect();
                    const rackRect = document.querySelector('.cable-offset').getBoundingClientRect();

                    // Рисуем кабель с прямыми углами
                    drawCable(
                        {
                            deviceName,
                            portName,
                            element: portElement,
                            rect: sourceRect
                        },
                        {
                            deviceName: portData.dst,
                            portName: portData.dstPort,
                            element: targetPortElement,
                            rect: targetRect
                        }
                    );

                    // Показываем информацию о соединении
                    const connectionInfo = document.getElementById('connection-info');
                    connectionInfo.innerHTML = `
                    <strong>Соединение:</strong><br>
                    ${deviceName}:${portName} ↔ 
                    ${portData.dst}:${portData.dstPort}<br>
                    VLAN: ${portData.tagged ? "tagged" : "untagged"} ${portData.vlan ? portData.vlan.join(', ') : 'не указан'}
                `;
                    connectionInfo.style.display = 'block';
                }
            }
        } else if (portData.dst && !devicesMap[portData.dst]) {
            // Для внешних соединений
            const connectionInfo = document.getElementById('connection-info');
            connectionInfo.innerHTML = `
            <strong>Внешнее подключение:</strong><br>
            Устройство: ${deviceName}<br>
            Порт: ${portName}<br>
            Внешняя система: ${portData.dst}<br>
            VLAN: ${portData.vlan ? portData.vlan.join(', ') : 'не указан'}
        `;
            connectionInfo.style.display = 'block';
        } else {
            // Для неподключенных портов
            const connectionInfo = document.getElementById('connection-info');
            connectionInfo.innerHTML = `Порт ${deviceName}:${portName} не подключен`;
            connectionInfo.style.display = 'block';
        }
    }

// Обработчик клика на порт (левая кнопка)

// Показать контекстное меню устройства
    function showDeviceContextMenu(e, device) {
        contextMenu.innerHTML = '';
        const addPortItem = document.createElement('div');
        addPortItem.className = 'context-menu-item';
        addPortItem.textContent = 'Добавить порт';
        addPortItem.addEventListener('click', () => {
            addPortToDevice(device);
            contextMenu.style.display = 'none';
        });

        const deleteItem = document.createElement('div');
        deleteItem.className = 'context-menu-item';
        deleteItem.textContent = 'Удалить устройство';
        deleteItem.addEventListener('click', () => {
            deleteDevice(device);
            contextMenu.style.display = 'none';
        });

        contextMenu.appendChild(addPortItem);
        contextMenu.appendChild(document.createElement('div')).className = 'context-menu-divider';
        contextMenu.appendChild(deleteItem);

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    }

// Показать контекстное меню порта
    function showPortContextMenu(e, deviceName, portName, portData) {
        currentPort = {deviceName, portName, portData};
        contextMenu.innerHTML = '';

        const editItem = document.createElement('div');
        editItem.className = 'context-menu-item';
        editItem.textContent = 'Редактировать порт';
        editItem.addEventListener('click', () => {
            showPortEditDialog(deviceName, portName, portData);
            contextMenu.style.display = 'none';
        });

        const deleteItem = document.createElement('div');
        deleteItem.className = 'context-menu-item';
        deleteItem.textContent = 'Удалить порт';
        deleteItem.addEventListener('click', () => {
            deletePort(deviceName, portName);
            contextMenu.style.display = 'none';
        });

        contextMenu.appendChild(editItem);
        contextMenu.appendChild(document.createElement('div')).className = 'context-menu-divider';
        contextMenu.appendChild(deleteItem);

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    }

// Добавить порт к устройству
    function addPortToDevice(device) {
        const portType = prompt("Введите тип порта (например: ETH, SFP):", "ETH");
        if (!portType) return;

        const portNumber = prompt("Введите номер порта:", "1");
        if (!portNumber) return;

        const portName = `${portType}${portNumber}`;

        if (device.ports[portName]) {
            alert("Порт с таким именем уже существует");
            return;
        }

        device.ports[portName] = {};
        renderRack();
        updateConfigTextarea();
    }

// Удалить устройство
    function deleteDevice(device) {
        if (!confirm(`Вы действительно хотите удалить устройство ${device.name}?`)) return;

        // Удаляем все ссылки на это устройство из других портов
        devices.forEach(d => {
            Object.values(d.ports).forEach(port => {
                if (port.dst === device.name) {
                    delete port.dst;
                    delete port.dstPort;
                }
            });
        });

        // Удаляем само устройство
        devices = devices.filter(d => d.name !== device.name);
        renderRack();
        updateConfigTextarea();
    }

// Удалить порт
    function deletePort(deviceName, portName) {
        if (!confirm(`Вы действительно хотите удалить порт ${deviceName}:${portName}?`)) return;

        const device = devices.find(d => d.name === deviceName);
        if (!device) return;

        // Удаляем обратное подключение если есть
        const portData = device.ports[portName];
        if (portData.dst) {
            const targetDevice = devices.find(d => d.name === portData.dst);
            if (targetDevice && portData.dstPort) {
                delete targetDevice.ports[portData.dstPort].dst;
                delete targetDevice.ports[portData.dstPort].dstPort;
            }
        }

        // Удаляем порт
        delete device.ports[portName];
        renderRack();
        updateConfigTextarea();
    }

// Показать диалог редактирования порта
    function showPortEditDialog(deviceName, portName, portData) {
        currentPort = {deviceName, portName, portData};

        // Заполняем форму
        editPortNameInput.value = `${deviceName}:${portName}`;
        editVlanInput.value = portData.vlan ? portData.vlan.join(',') : '';

        // Заполняем выпадающий список устройств и портов
        editDstInput.innerHTML = '<option value="">-- Не подключен --</option>';

        // Добавляем внешние системы
        const externalOption = document.createElement('option');
        externalOption.value = "EXTERNAL";
        externalOption.textContent = "-- Внешняя система --";
        editDstInput.appendChild(externalOption);

        // Добавляем устройства и их порты
        devices.forEach(device => {
            if (device.name !== deviceName) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = device.name;

                Object.keys(device.ports).forEach(pName => {
                    const option = document.createElement('option');
                    option.value = `${device.name}:${pName}`;
                    option.textContent = pName;

                    // Выбираем текущее подключение
                    if (portData.dst === device.name && portData.dstPort === pName) {
                        option.selected = true;
                    }

                    optgroup.appendChild(option);
                });

                editDstInput.appendChild(optgroup);
            }
        });

        // Выбираем внешнюю систему если подключение внешнее
        if (portData.dst && !devicesMap[portData.dst]) {
            externalOption.selected = true;
        }

        // Показываем модальное окно
        editPortModal.style.display = 'flex';
    }

// Сохранить конфигурацию порта
    function savePortConfig() {
        const vlan = editVlanInput.value.trim();
        const dst = editDstInput.value;

        // Находим устройство и порт
        const device = devices.find(d => d.name === currentPort.deviceName);
        if (!device) return;

        // Очищаем предыдущее подключение если оно было
        const prevDst = device.ports[currentPort.portName].dst;
        const prevDstPort = device.ports[currentPort.portName].dstPort;

        if (prevDst && prevDstPort) {
            const targetDevice = devices.find(d => d.name === prevDst);
            if (targetDevice && targetDevice.ports[prevDstPort]) {
                delete targetDevice.ports[prevDstPort].dst;
                delete targetDevice.ports[prevDstPort].dstPort;
            }
        }

        // Создаем новую конфигурацию порта
        const portConfig = {};

        // Добавляем VLAN если указаны
        if (vlan) {
            portConfig.vlan = vlan.split(',').map(Number).filter(n => !isNaN(n));
        }

        // Добавляем подключение если указано
        if (dst === "EXTERNAL") {
            // Для внешних систем запрашиваем имя
            const extName = prompt("Введите имя внешней системы:");
            if (extName) {
                portConfig.dst = extName;
            }
        } else if (dst) {
            const [dstDevice, dstPort] = dst.split(':');
            portConfig.dst = dstDevice;
            portConfig.dstPort = dstPort;

            // Добавляем обратное подключение
            const targetDevice = devices.find(d => d.name === dstDevice);
            if (targetDevice && targetDevice.ports[dstPort]) {
                targetDevice.ports[dstPort].dst = currentPort.deviceName;
                targetDevice.ports[dstPort].dstPort = currentPort.portName;
            }
        }

        // Сохраняем конфигурацию порта
        device.ports[currentPort.portName] = portConfig;

        // Перерисовываем стойку
        renderRack();
        updateConfigTextarea();

        // Закрываем модальное окно
        editPortModal.style.display = 'none';
    }

// Загрузить конфигурацию из текстового поля
    function loadConfig() {
        try {
            const newDevices = JSON.parse(configTextarea.value);
            if (Array.isArray(newDevices)) {
                devices = newDevices;
                renderRack();
            } else {
                alert("Конфигурация должна быть массивом устройств");
            }
        } catch (e) {
            alert("Ошибка при разборе JSON: " + e.message);
        }
    }

// Экспортировать текущую конфигурацию в JSON
    function exportConfig() {
        configTextarea.value = JSON.stringify(devices, null, 2);

        // Создаем временный элемент для копирования
        const textarea = document.createElement('textarea');
        textarea.value = configTextarea.value;
        document.body.appendChild(textarea);
        textarea.select();
        if (!navigator.clipboard) {
            document.execCommand('copy');
        } else {
            navigator.clipboard.writeText(configTextarea.value)
        }
        document.body.removeChild(textarea);
        alert("Конфигурация скопирована в буфер обмена");
    }

// Добавить новое устройство
    function saveNewDevice() {
        try {
            const name = deviceNameInput.value.trim();
            const portType = portTypeInput.value;
            const portCount = parseInt(portCountInput.value);
            const startPort = parseInt(startPortInput.value);

            if (!name) {
                alert("Введите имя устройства");
                return;
            }

            if (isNaN(portCount) || portCount < 1 || portCount > 48) {
                alert("Укажите корректное количество портов (1-48)");
                return;
            }

            if (isNaN(startPort) || startPort < 1) {
                alert("Укажите корректный начальный номер порта");
                return;
            }

            // Проверяем, есть ли уже устройство с таким именем
            if (devices.some(d => d.name === name)) {
                alert("Устройство с таким именем уже существует");
                return;
            }

            // Создаем порты
            const ports = {};
            for (let i = 0; i < portCount; i++) {
                const portName = `${portType}${startPort + i}`;
                ports[portName] = {};
            }

            // Добавляем новое устройство
            devices.push({
                name: name,
                ports: ports
            });

            // Закрываем модальное окно
            addDeviceModal.style.display = 'none';

            // Перерисовываем стойку
            renderRack();
            updateConfigTextarea();

        } catch (e) {
            alert("Ошибка: " + e.message);
        }
    }

// Очистить все устройства
    function clearAll() {
        if (confirm("Вы действительно хотите удалить все устройства?")) {
            devices = [];
            renderRack();
            updateConfigTextarea();
        }
    }

// Обновить текстовое поле с конфигурацией
    function updateConfigTextarea() {
        configTextarea.value = JSON.stringify(devices, null, 2);
    }

    init()
}

// Инициализация приложения