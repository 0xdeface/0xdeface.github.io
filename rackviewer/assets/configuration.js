const PREDEFINED_CFG =
    [
        {
            "name": "SW-KHV-IND-2",
            "ports": {
                "ETH1": {},
                "ETH2": {},
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {},
                "ETH9": {},
                "ETH10": {},
                "ETH11": {},
                "ETH12": {},
                "ETH13": {},
                "ETH14": {},
                "ETH15": {},
                "ETH16": {},
                "ETH17": {},
                "ETH18": {},
                "ETH19": {},
                "ETH20": {}
            }
        },
        {
            "name": "SW-KHV-IND-0",
            "ports": {
                "ETH1": {},
                "ETH2": {},
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {}
            }
        },
        {
            "name": "GW-KHV-KRS",
            "ports": {
                "SFP1": {
                    "vlan": [
                        1
                    ],
                    "dst": "SW-KHV-IND-4",
                    "dstPort": "SFP9"
                },
                "SFP2": {},
                "ETH1": {
                    "vlan": [
                        1
                    ],
                    "dst": "REDCOM"
                },
                "ETH2": {
                    "vlan": [
                        1
                    ],
                    "dst": "ENFORTA"
                },
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {},
                "ETH9": {},
                "ETH10": {},
                "ETH11": {},
                "ETH12": {},
                "ETH13": {},
                "ETH14": {},
                "ETH15": {},
                "ETH16": {}
            }
        },
        {
            "name": "SW-KHV-IND-4",
            "ports": {
                "ETH1": {
                    "vlan": [
                        1
                    ],
                    "dst": "REDCOM"
                },
                "SFP1": {},
                "SFP2": {},
                "SFP3": {},
                "SFP4": {},
                "SFP5": {},
                "SFP6": {},
                "SFP7": {},
                "SFP8": {},
                "SFP9": {
                    "vlan": [
                        1
                    ],
                    "dst": "GW-KHV-KRS",
                    "dstPort": "SFP1"
                },
                "SFP10": {},
                "SFP11": {},
                "SFP12": {},
                "SFP13": {
                    "dst": "SW-KHV-IND-5",
                    "dstPort": "SFP2"
                },
                "SFP14": {
                    "vlan": [
                        80
                    ],
                    "tagged": true,
                    "dst": "SW-KHV-IND-1",
                    "dstPort": "SFP1"
                },
                "SFP15": {},
                "SFP16": {}
            }
        },
        {
            "name": "SW-KHV-IND-3",
            "ports": {
                "ETH1": {},
                "ETH2": {},
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {}
            }
        },
        {
            "name": "SW-KHV-IND-1",
            "ports": {
                "SFP1": {
                    "vlan": [
                        80
                    ],
                    "dst": "SW-KHV-IND-4",
                    "dstPort": "SFP14"
                },
                "ETH1": {},
                "ETH2": {},
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {},
                "ETH9": {},
                "ETH10": {},
                "ETH11": {},
                "ETH12": {},
                "ETH13": {},
                "ETH14": {},
                "ETH15": {},
                "ETH16": {}
            }
        },
        {
            "name": "SW-KHV-IND-5",
            "ports": {
                "SFP1": {},
                "SFP2": {
                    "vlan": [
                        80
                    ],
                    "dst": "SW-KHV-IND-4",
                    "dstPort": "SFP13"
                },
                "ETH1": {},
                "ETH2": {},
                "ETH3": {},
                "ETH4": {},
                "ETH5": {},
                "ETH6": {},
                "ETH7": {},
                "ETH8": {},
                "ETH9": {},
                "ETH10": {},
                "ETH11": {},
                "ETH12": {},
                "ETH13": {},
                "ETH14": {},
                "ETH15": {},
                "ETH16": {}
            }
        }
    ]
