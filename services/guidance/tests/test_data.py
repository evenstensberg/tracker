chart_summary_criteria_data = {
    "mailSummaryCriteria": {"pass": ["dmarc23", "dmarc10", "spf12"], "fail": [""]},
    "webSummaryCriteria": {
        "pass": ["ssl5"],
        "fail": [
            "https2",
            "https3",
            "https4",
            "https5",
            "https6",
            "https7",
            "https8",
            "https9",
            "https10",
            "https11",
            "https12",
            "https13",
            "https14",
            "ssl2",
            "ssl3",
            "ssl4",
            "ssl6",
            "ssl7",
            "ssl8",
        ],
    },
}

scan_summary_criteria_data = {
    "httpsScanSummaryCriteria": {
        "pass": [""],
        "fail": [
            "https2",
            "https3",
            "https4",
            "https5",
            "https6",
            "https7",
            "https8",
            "https9",
            "https10",
            "https11",
            "https12",
            "https13",
            "https14",
        ],
        "info": ["https1"],
        "warning": [""],
    },
    "sslScanSummaryCriteria": {
        "pass": ["ssl5"],
        "fail": ["ssl2", "ssl3", "ssl4", "ssl6", "ssl7", "ssl8"],
        "info": ["ssl1"],
        "warning": [""],
    },
    "dkimScanSummaryCriteria": {
        "pass": ["dkim7", "dkim8"],
        "fail": [
            "dkim2",
            "dkim3",
            "dkim4",
            "dkim5",
            "dkim6",
            "dkim9",
            "dkim11",
            "dkim12",
        ],
        "warning": ["dkim10", "dkim13"],
        "info": ["dkim1"],
    },
    "spfScanSummaryCriteria": {
        "pass": "spf12",
        "fail": [""],
        "info": [""],
        "warning": [""],
    },
    "dmarcScanSummaryCriteria": {
        "pass": "dmarc23",
        "fail": [""],
        "info": [""],
        "warning": [""],
    },
}

aggregate_tag_data = {
    "agg1": {
        "en": {
            "tagName": "agg-spf-no-record",
            "guidance": "No SPF record for envelope-from domain",
            "refLinksGuide": [
                {
                    "description": "A.3.3 Deploy SPF for All Domains",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna33",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
        "fr": {
            "tagName": "agg-spf-no-record",
            "guidance": 'Pas d\'enregistrement SPF pour le domaine "envelope-from"',
            "refLinksGuide": [
                {
                    "description": "A.3.3 Déployer le protocole SPF pour tous les domaines",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
    },
    "agg2": {
        "en": {
            "tagName": "agg-spf-invalid",
            "guidance": "SPF record is invalid",
            "refLinksGuide": [
                {
                    "description": "B.1 SPF",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb1",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
        "fr": {
            "tagName": "agg-spf-invalid",
            "guidance": "L'enregistrement SPF n'est pas valide",
            "refLinksGuide": [
                {
                    "description": "B.1 Protocole SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb1",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
    },
    "agg3": {
        "en": {
            "tagName": "agg-spf-failed",
            "guidance": "IP address not authorized for envelope-from or header-from domain",
            "refLinksGuide": [
                {
                    "description": "B.1 SPF",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb1",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 2.6 Reults of Evaluation",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-2.6",
                }
            ],
        },
        "fr": {
            "tagName": "agg-spf-failed",
            "guidance": 'Adresse IP non autorisée pour le domaine "envelope-from" ou "header-from"',
            "refLinksGuide": [
                {
                    "description": "B.1 Protocole SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb1",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 2.6 Reults of Evaluation (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-2.6",
                }
            ],
        },
    },
    "agg4": {
        "en": {
            "tagName": "agg-spf-mismatch",
            "guidance": "Header-from and envelope-from are different public domains",
            "refLinksGuide": [
                {
                    "description": "2.4.1 DMARC Validation",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
        "fr": {
            "tagName": "agg-spf-mismatch",
            "guidance": '"Header-from" et "envelope-from" sont des domaines publics différents',
            "refLinksGuide": [
                {
                    "description": "2.4.1 Authentification par le protocole DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
    },
    "agg5": {
        "en": {
            "tagName": "agg-spf-strict",
            "guidance": "Header-from and envelope-from domains are not strictly aligned",
            "refLinksGuide": [
                {
                    "description": "2.4.1 DMARC Validation",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
        "fr": {
            "tagName": "agg-spf-strict",
            "guidance": 'Les domaines "Header-from" et "envelope-from" ne sont pas strictement alignés',
            "refLinksGuide": [
                {
                    "description": "2.4.1 Authentification par le protocole DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
    },
    "agg6": {
        "en": {
            "tagName": "agg-dkim-unsigned",
            "guidance": "No DKIM signature was applied",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Deploy DKIM for All Domains and Senders",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna34",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376",
                }
            ],
        },
        "fr": {
            "tagName": "agg-dkim-unsigned",
            "guidance": "Aucune signature DKIM n'a été appliquée",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Déployer le protocole DKIM pour tous les domaines et expéditeurs",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna34",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM) (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376",
                }
            ],
        },
    },
    "agg7": {
        "en": {
            "tagName": "agg-dkim-invalid",
            "guidance": "DKIM record is invalid",
            "refLinksGuide": [
                {
                    "description": "B.2 DKIM",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb2",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 7.5 _domainkey DNS TXT Resource Record Tag Specifications",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-7.5",
                }
            ],
        },
        "fr": {
            "tagName": "agg-dkim-invalid",
            "guidance": "L'enregistrement DKIM est invalide",
            "refLinksGuide": [
                {
                    "description": "B.2 DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb2",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 7.5 _domainkey DNS TXT Resource Record Tag Specifications (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-7.5",
                }
            ],
        },
    },
    "agg8": {
        "en": {
            "tagName": "agg-dkim-failed",
            "guidance": "DKIM signature verification failed",
            "refLinksGuide": [
                {
                    "description": "B.2 DKIM",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb2",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 6 Verifier Actions",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-6",
                }
            ],
        },
        "fr": {
            "tagName": "agg-dkim-failed",
            "guidance": "La vérification de la signature DKIM a échoué",
            "refLinksGuide": [
                {
                    "description": "B.2 DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb2",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 6 Verifier Actions (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-6",
                }
            ],
        },
    },
    "agg9": {
        "en": {
            "tagName": "agg-dkim-mismatch",
            "guidance": "DKIM header and envelope-from are different public domains",
            "refLinksGuide": [
                {
                    "description": "2.4.1 DMARC Validation",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
        "fr": {
            "tagName": "agg-dkim-mismatch",
            "guidance": 'DKIM "header-from" et "envelope-from" sont des domaines publics différents',
            "refLinksGuide": [
                {
                    "description": "2.4.1 Authentification par le protocole DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
    },
    "agg10": {
        "en": {
            "tagName": "agg-dkim-strict",
            "guidance": "DKIM header and envelope-from are not strictly aligned",
            "refLinksGuide": [
                {
                    "description": "2.4.1 DMARC Validation",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
        "fr": {
            "tagName": "agg-dkim-strict",
            "guidance": 'DKIM "header-from" et "envelope-from" ne sont pas strictement alignés',
            "refLinksGuide": [
                {
                    "description": "2.4.1 Authentification par le protocole DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a241",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 3.1 Identifier Alignment (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-3.1",
                }
            ],
        },
    },
}

dkim_tag_data = {
    "dkim1": {
        "en": {
            "tagName": "DKIM-GC",
            "guidance": "Government of Canada domains subject to TBS guidelines",
            "refLinksGuide": [{"description": "IT PIN"}],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "DKIM-GC",
            "guidance": "Les domaines du gouvernement du Canada sont soumis aux directives du SCT",
            "refLinksGuide": [{"description": "AMPTI"}],
            "refLinksTechnical": [""],
        },
    },
    "dkim2": {
        "en": {
            "tagName": "DKIM-missing",
            "guidance": "Follow implementation guide",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Deploy DKIM for All Domains and Senders",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna34",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376",
                }
            ],
        },
        "fr": {
            "tagName": "DKIM-missing",
            "guidance": "Suivre le guide de mise en œuvre",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Déployer le protocole DKIM pour tous les domaines et expéditeurs",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna34",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM) (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376",
                }
            ],
        },
    },
    "dkim3": {
        "en": {
            "tagName": "DKIM-missing-mx-O365",
            "guidance": "DKIM record missing but MX uses O365. Follow cloud-specific guidance.",
            "refLinksGuide": [
                {
                    "description": "3.2.2 Third Parties and DKIM",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a322",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Microsoft DKIM Guidance",
                    "tech_link": "https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide",
                }
            ],
        },
        "fr": {
            "tagName": "DKIM-missing-mx-O365",
            "guidance": "L'enregistrement DKIM est manquant mais MX utilise O365. Suivez les conseils spécifiques au cloud.",
            "refLinksGuide": [
                {
                    "description": "3.2.2 Expéditeurs tiers et DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a322",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Microsoft DKIM Guidance (EN)",
                    "tech_link": "https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide",
                }
            ],
        },
    },
    "dkim4": {
        "en": {
            "tagName": "DKIM-missing-O365-misconfigured",
            "guidance": "DKIM CNAMEs do not exist, but MX points to *.onmicrosoft.com and SPF record includes O365",
            "refLinksGuide": [
                {
                    "description": "3.2.2 Third Parties and DKIM",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a322",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Microsoft DKIM Guidance",
                    "tech_link": "https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide",
                }
            ],
        },
        "fr": {
            "tagName": "DKIM-missing-O365-misconfigured",
            "guidance": "Les CNAME DKIM n'existent pas, mais le MX pointe vers *.onmicrosoft.com et l'enregistrement SPF inclut O365.",
            "refLinksGuide": [
                {
                    "description": "3.2.2 Expéditeurs tiers et DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a322",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Microsoft DKIM Guidance (EN)",
                    "tech_link": "https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide",
                }
            ],
        },
    },
    "dkim5": {
        "en": {
            "tagName": "P-sub1024",
            "guidance": "Public key RSA and key length <1024",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Cryptographic Considerations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-sub1024",
            "guidance": "Clé publique RSA et longueur de clé <1024",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Considérations cryptographiques",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim6": {
        "en": {
            "tagName": "P-1024",
            "guidance": "Public key RSA and key length 1024",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Cryptographic Considerations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-1024",
            "guidance": "Clé publique RSA et longueur de clé 1024",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Considérations cryptographiques",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim7": {
        "en": {
            "tagName": "P-2048",
            "guidance": "Public key RSA and key length 2048",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Cryptographic Considerations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-2048",
            "guidance": "Clé publique RSA et longueur de clé 2048",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Considérations cryptographiques",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim8": {
        "en": {
            "tagName": "P-4096",
            "guidance": "Public key RSA and key length 4096 or higher",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Cryptographic Considerations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-4096",
            "guidance": "Clé publique RSA et longueur de clé de 4096 ou plus",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Considérations cryptographiques",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim9": {
        "en": {
            "tagName": "P-invalid",
            "guidance": "Invalid public key",
            "refLinksGuide": [
                {
                    "description": "B.2.1 DKIM Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-invalid",
            "guidance": "Clé publique non valide",
            "refLinksGuide": [
                {
                    "description": "B.2.1 Enregistrements DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim10": {
        "en": {
            "tagName": "P-update-recommended",
            "guidance": "Public key in use for longer than 1 year",
            "refLinksGuide": [
                {
                    "description": "A.5.3 Rotate DKIM Keys",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna53",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "P-update-recommended",
            "guidance": "Clé publique utilisée depuis plus d'un an",
            "refLinksGuide": [
                {
                    "description": "A.5.3 Assurer la rotation des clés DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna53",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "dkim11": {
        "en": {
            "tagName": "DKIM-invalid-crypto",
            "guidance": "DKIM key does not use RSA",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Cryptographic Considerations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
        "fr": {
            "tagName": "DKIM-invalid-crypto",
            "guidance": "La clé DKIM n'utilise pas le RSA",
            "refLinksGuide": [
                {
                    "description": "B.2.2 Considérations cryptographiques",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb22",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.3 Signing and Verification Algorithms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.3",
                }
            ],
        },
    },
    "dkim12": {
        "en": {
            "tagName": "DKIM-value-invalid",
            "guidance": "DKIM TXT record invalid",
            "refLinksGuide": [
                {
                    "description": "B.2.1 DKIM Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.6 Key Management and Representation",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.6",
                }
            ],
        },
        "fr": {
            "tagName": "DKIM-value-invalid",
            "guidance": "Enregistrement DKIM TXT invalide",
            "refLinksGuide": [
                {
                    "description": "B.2.1 Enregistrements DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.6 Key Management and Representation (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.6",
                }
            ],
        },
    },
    "dkim13": {
        "en": {
            "tagName": "T-enabled",
            "guidance": 'DKIM flag "t=y" disables DKIM verification',
            "refLinksGuide": [
                {
                    "description": "B.2.1 DKIM Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.6 Key Management and Representation",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.6",
                }
            ],
        },
        "fr": {
            "tagName": "T-enabled",
            "guidance": 'L\'indicateur DKIM "t=y" désactive la vérification DKIM',
            "refLinksGuide": [
                {
                    "description": "B.2.1 Enregistrements DKIM",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb21",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 6376 (DKIM), 3.6 Key Management and Representation (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc6376#section-3.6",
                }
            ],
        },
    },
    "dkim14": {
        "en": {
            "tagName": "P-duplicate",
            "guidance": "Public key used for multiple domains",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Deploy DKIM for ALl Domains and Senders",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna34",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "P-duplicate",
            "guidance": "Clé publique utilisée pour plusieurs domaines",
            "refLinksGuide": [
                {
                    "description": "A.3.4 Déployer le protocole DKIM pour tous les domaines et expéditeurs",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna34",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
}

dmarc_tag_data = {
    "dmarc1": {
        "en": {
            "tagName": "DMARC-GC",
            "guidance": "Government of Canada domains subject to TBS guidelines",
            "refLinksGuide": [{"description": "IT PIN", "ref_link": ""}],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "DMARC-GC",
            "guidance": "Les domaines du gouvernement du Canada sont soumis aux directives du SCT",
            "refLinksGuide": [{"description": "AMPTI"}],
            "refLinksTechnical": [""],
        },
    },
    "dmarc2": {
        "en": {
            "tagName": "DMARC-missing",
            "guidance": "No DMARC record for header-from domain",
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6 Policy",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6",
                }
            ],
        },
        "fr": {
            "tagName": "DMARC-missing",
            "guidance": 'Pas d\'enregistrement DMARC pour le domaine "header-from".',
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6 Policy (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6",
                }
            ],
        },
    },
    "dmarc3": {
        "en": {
            "tagName": "P-missing",
            "guidance": 'DMARC record missing mandatory "p" tag',
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-missing",
            "guidance": 'L\'enregistrement DMARC ne contient pas la balise obligatoire ""',
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6 Policy (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6",
                }
            ],
        },
    },
    "dmarc4": {
        "en": {
            "tagName": "P-none",
            "guidance": 'DMARC enforcement policy of "none"',
            "refLinksGuide": [
                {
                    "description": "A.3.5 Monitor DMARC Reports and Correct Misconfigurations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna35",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-none",
            "guidance": 'Politique d\'application de DMARC de "none"',
            "refLinksGuide": [
                {
                    "description": "A.3.5 Surveiller les rapports DMARC et corriger les erreurs de configuration",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna35",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc5": {
        "en": {
            "tagName": "P-quarantine",
            "guidance": 'DMARC enforcement policy of "quarantine"',
            "refLinksGuide": [
                {
                    "description": "A.4 Enforce",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna4",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-quarantine",
            "guidance": 'Politique d\'application de DMARC de "quarantaine"',
            "refLinksGuide": [
                {
                    "description": "A.4 Appliquer",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna4",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc6": {
        "en": {
            "tagName": "P-reject",
            "guidance": 'DMARC enforcement policy of "reject"',
            "refLinksGuide": [
                {
                    "description": "A.5 Maintain",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna5",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "P-reject",
            "guidance": 'Politique d\'application de DMARC de "reject"',
            "refLinksGuide": [
                {
                    "description": "A.5 Tenir les éléments à jour",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna5",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc7": {
        "en": {
            "tagName": "PCT-100",
            "guidance": "Policy applied to all DMARC failures",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "PCT-100",
            "guidance": "Politique appliquée à tous les échecs DMARC",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc8": {
        "en": {
            "tagName": "PCT-xx",
            "guidance": "Policy applied to percentage of DMARC failures",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "PCT-xx",
            "guidance": "Politique appliquée au pourcentage d'échecs DMARC",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc9": {
        "en": {
            "tagName": "PCT-invalid",
            "guidance": "Invalid percentage",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "PCT-invalid",
            "guidance": "Pourcentage invalide",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc10": {
        "en": {
            "tagName": "RUA-CCCS",
            "guidance": "CCCS as aggregate report destination",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "RUA-CCCS",
            "guidance": "CCCS comme destination des rapports agrégés",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc11": {
        "en": {
            "tagName": "RUF-CCCS",
            "guidance": "CCCS as forensic report destination",
            "refLinksGuide": [
                {
                    "description": "2.4.2 DMARC Reporting",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a242",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "RUF-CCCS",
            "guidance": "CCCS comme destination des rapports médico-légaux",
            "refLinksGuide": [
                {
                    "description": "2.4.2 Rapports DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a242",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc12": {
        "en": {
            "tagName": "RUA-none",
            "guidance": "No aggregate report destinations",
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "RUA-none",
            "guidance": "Pas de destinations de rapports agrégés",
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc13": {
        "en": {
            "tagName": "RUF-none",
            "guidance": "No forensic report destinations",
            "refLinksGuide": [
                {
                    "description": "2.4.2 DMARC Reporting",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a242",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "RUF-none",
            "guidance": "Pas de destination de rapport médico-légal",
            "refLinksGuide": [
                {
                    "description": "2.4.2 Rapports DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a242",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc14": {
        "en": {
            "tagName": "TXT-DMARC-enabled",
            "guidance": "Third-party report destinations valid",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Third Parties and DMARC",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
        "fr": {
            "tagName": "TXT-DMARC-enabled",
            "guidance": "Destinations des rapports de tiers valides",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Expéditeurs tiers et DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
    },
    "dmarc15": {
        "en": {
            "tagName": "TXT-DMARC-missing",
            "guidance": "Third-party report destinations invalid",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Third Parties and DMARC",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
        "fr": {
            "tagName": "TXT-DMARC-missing",
            "guidance": "Les destinations des rapports de tiers ne sont pas valides",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Expéditeurs tiers et DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
    },
    "dmarc16": {
        "en": {
            "tagName": "SP-missing",
            "guidance": 'Subdomain policy not specified with "sp" tag',
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "SP-missing",
            "guidance": 'La politique de sous-domaine n\'est pas spécifiée avec la balise "sp"',
            "refLinksGuide": [
                {
                    "description": "A.2.3 Deploy Initial DMARC record",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna23",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc17": {
        "en": {
            "tagName": "SP-none",
            "guidance": 'Subdomain policy of "none"',
            "refLinksGuide": [
                {
                    "description": "A.3.5 Monitor DMARC Reports and Correct Misconfigurations",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna35",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "SP-none",
            "guidance": 'Politique de sous-domaine de "none"',
            "refLinksGuide": [
                {
                    "description": "A.3.5 Surveiller les rapports DMARC et corriger les erreurs de configuration",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna35",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc18": {
        "en": {
            "tagName": "SP-quarantine",
            "guidance": 'Subdomain policy of "quarantine"',
            "refLinksGuide": [
                {
                    "description": "A.4 Enforce",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna4",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "SP-quarantine",
            "guidance": 'Politique de sous-domaine de "quarantaine"',
            "refLinksGuide": [
                {
                    "description": "A.4 Appliquer",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna4",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc19": {
        "en": {
            "tagName": "SP-reject",
            "guidance": 'Subdomain policy of "reject"',
            "refLinksGuide": [
                {
                    "description": "A.5 Maintain",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna5",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "SP-reject",
            "guidance": 'Politique des sous-domaines de "reject"',
            "refLinksGuide": [
                {
                    "description": "A.5 Tenir les éléments à jour",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna5",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc20": {
        "en": {
            "tagName": "PCT-none-exists",
            "guidance": '"pct" should be 100, or not included with "p=none"',
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "PCT-none-exists",
            "guidance": '"pct" devrait être 100, ou ne pas être inclus avec "p=none"',
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc21": {
        "en": {
            "tagName": "PCT-0",
            "guidance": "Policy applies to no failures - irregular config",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "PCT-0",
            "guidance": "La politique s'applique à toutes les défaillances - configuration irrégulière",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
    "dmarc22": {
        "en": {
            "tagName": "CNAME-DMARC",
            "guidance": "Domain uses potentially outsourced DMARC service",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Third Parties and DMARC",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
        "fr": {
            "tagName": "CNAME-DMARC",
            "guidance": "Le domaine utilise un service DMARC potentiellement externalisé.",
            "refLinksGuide": [
                {
                    "description": "3.2.3 Expéditeurs tiers et DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#a323",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 7.1 Verifying External Destinations (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-7.1",
                }
            ],
        },
    },
    "dmarc23": {
        "en": {
            "tagName": "DMARC-valid",
            "guidance": "DMARC record is properly formed",
            "refLinksGuide": [
                {
                    "description": "B.3.1 DMARC Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
        "fr": {
            "tagName": "DMARC-valid",
            "guidance": "L'enregistrement DMARC est correctement formé",
            "refLinksGuide": [
                {
                    "description": "B.3.1 Enregistrements DMARC",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb31",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7489 (DMARC), 6.3 General Record Format (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7489#section-6.3",
                }
            ],
        },
    },
}

https_tag_data = {
    "https1": {
        "en": {
            "tagName": "HTTPS-GC",
            "guidance": "Government of Canada domains subject to TBS guidelines",
            "refLinksGuide": [
                {
                    "description": "ITPIN 2018-01",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-GC",
            "guidance": "Les domaines du gouvernement du Canada sont soumis aux directives du SCT",
            "refLinksGuide": [
                {
                    "description": "AMPTI 2018-01",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https2": {
        "en": {
            "tagName": "HTTPS-missing",
            "guidance": "Follow implementation guide",
            "refLinksGuide": [
                {
                    "description": "6.1 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-missing",
            "guidance": "Suivre le guide de mise en œuvre",
            "refLinksGuide": [
                {
                    "description": "6.1 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https3": {
        "en": {
            "tagName": "HTTPS-downgraded",
            "guidance": "Canonical HTTPS endpoint internally redirects to HTTP. Follow guidance.",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-downgraded",
            "guidance": "Le point de terminaison HTTPS canonique redirige en interne vers HTTP. Suivez les instructions.",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https4": {
        "en": {
            "tagName": "HTTPS-bad-chain",
            "guidance": "HTTPS certificate chain is invalid",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-bad-chain",
            "guidance": "La chaîne de certificats HTTPS n'est pas valide",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https5": {
        "en": {
            "tagName": "HTTPS-bad-hostname",
            "guidance": "HTTPS endpoint failed hostname validation",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-bad-hostname",
            "guidance": "La validation du nom d'hôte du point de terminaison HTTPS a échoué",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https6": {
        "en": {
            "tagName": "HTTPS-not-enforced",
            "guidance": "Domain does not enforce HTTPS",
            "refLinksGuide": [
                {
                    "description": "6.1.1/6.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-not-enforced",
            "guidance": "Le domaine n'applique pas le protocole HTTPS",
            "refLinksGuide": [
                {
                    "description": "6.1.1/6.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https7": {
        "en": {
            "tagName": "HTTPS-weakly-enforced",
            "guidance": "Domain does not default to HTTPS",
            "refLinksGuide": [
                {
                    "description": "6.1.1/6.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-weakly-enforced",
            "guidance": "Le domaine ne fonctionne pas par défaut en HTTPS",
            "refLinksGuide": [
                {
                    "description": "6.1.1/6.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https8": {
        "en": {
            "tagName": "HTTPS-moderately-enforced",
            "guidance": "Domain defaults to HTTPS, but eventually redirects to HTTP",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-moderately-enforced",
            "guidance": "Le domaine passe par défaut en HTTPS, mais finit par être redirigé en HTTP",
            "refLinksGuide": [
                {
                    "description": "6.1.1 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https9": {
        "en": {
            "tagName": "HSTS-missing",
            "guidance": "HTTP Strict Transport Security (HSTS) not implemented",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HSTS-missing",
            "guidance": "HTTP Strict Transport Security (HSTS) non implémenté",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https10": {
        "en": {
            "tagName": "HSTS-short-age",
            "guidance": "HTTP Strict Transport Security (HSTS) policy maximum age is shorter than one year",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HSTS-short-age",
            "guidance": "L'âge maximum de la politique HTTP Strict Transport Security (HSTS) est inférieur à un an.",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https11": {
        "en": {
            "tagName": "HSTS-preload-ready",
            "guidance": "Domain not pre-loaded by HSTS, but is pre-load ready",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HSTS-preload-ready",
            "guidance": "Domaine non préchargé par HSTS, mais prêt à l'être",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https12": {
        "en": {
            "tagName": "HSTS-not-preloaded",
            "guidance": "Domain not pre-loaded by HSTS",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HSTS-not-preloaded",
            "guidance": "Domaine non préchargé par HSTS",
            "refLinksGuide": [
                {
                    "description": "6.1.2 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https13": {
        "en": {
            "tagName": "HTTPS-certificate-expired",
            "guidance": "HTTPS certificate is expired",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-certificate-expired",
            "guidance": "Le certificat HTTPS a expiré",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https14": {
        "en": {
            "tagName": "HTTPS-certificate-self-signed",
            "guidance": "HTTPS certificate is self-signed",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-certificate-self-signed",
            "guidance": "Le certificat HTTPS est auto-signé",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https15": {
        "en": {
            "tagName": "HTTPS-certificate-revoked",
            "guidance": "HTTPS certificate has been revoked",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-certificate-revoked",
            "guidance": "Le certificat HTTPS a été révoqué",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "https16": {
        "en": {
            "tagName": "HTTPS-certificate-revocation-unknown",
            "guidance": "Revocation status of HTTPS certificate could not be checked",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "HTTPS-certificate-revocation-unknown",
            "guidance": "L'état de révocation du certificat HTTPS n'a pas pu être vérifié",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
}


spf_tag_data = {
    "spf1": {
        "en": {
            "tagName": "SPF-GC",
            "guidance": "Government of Canada domains subject to TBS guidelines",
            "refLinksGuide": [{"description": "IT PIN", "ref_link": ""}],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "SPF-GC",
            "guidance": "Les domaines du gouvernement du Canada sont soumis aux directives du SCT",
            "refLinksGuide": [{"description": "AMPTI"}],
            "refLinksTechnical": [""],
        },
    },
    "spf2": {
        "en": {
            "tagName": "SPF-missing",
            "guidance": "Follow implementation guide",
            "refLinksGuide": [
                {
                    "description": "A.3.3 Deploy SPF for All Domains",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#anna33",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
        "fr": {
            "tagName": "SPF-missing",
            "guidance": "Suivre le guide de mise en œuvre",
            "refLinksGuide": [
                {
                    "description": "A.3.3 Déployer le protocole SPF pour tous les domaines",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#anna33",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
    },
    "spf3": {
        "en": {
            "tagName": "SPF-bad-path",
            "guidance": "SPF implemented in incorrect subdomain",
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
        "fr": {
            "tagName": "SPF-bad-path",
            "guidance": "SPF implémenté dans un sous-domaine incorrect",
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
    },
    "spf4": {
        "en": {
            "tagName": "ALL-missing",
            "guidance": 'Record not terminated with "-all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.7 Default Results",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.7",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-missing",
            "guidance": 'Enregistrement non terminé par "-all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.7 Default Results (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.7",
                }
            ],
        },
    },
    "spf5": {
        "en": {
            "tagName": "ALL-allow",
            "guidance": 'Record terminated with insecure "+all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-allow",
            "guidance": 'Enregistrement terminé avec insecure "+all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
    },
    "spf6": {
        "en": {
            "tagName": "ALL-neutral",
            "guidance": 'Record terminated with insecure "?all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-neutral",
            "guidance": 'Enregistrement terminé avec insecure "?all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
    },
    "spf7": {
        "en": {
            "tagName": "ALL-softfail",
            "guidance": 'Record terminated with insecure "~all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-softfail",
            "guidance": 'Enregistrement terminé avec insecure "~all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
    },
    "spf8": {
        "en": {
            "tagName": "ALL-hardfail",
            "guidance": 'Record terminated with "-all"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-hardfail",
            "guidance": "L'enregistrement s'est terminé par \"-all\"",
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.2 Mechanisms (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.2",
                }
            ],
        },
    },
    "spf9": {
        "en": {
            "tagName": "ALL-redirect",
            "guidance": 'Record includes "redirect"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 6.1 redirect: Redirected Query",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-6.1",
                }
            ],
        },
        "fr": {
            "tagName": "ALL-redirect",
            "guidance": 'L\'enregistrement comprend la "redirect"',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 6.1 redirect: Redirected Query (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-6.1",
                }
            ],
        },
    },
    "spf10": {
        "en": {
            "tagName": "A-all",
            "guidance": '"a" entry without hostname',
            "refLinksGuide": [
                {
                    "description": "B.1.1 SPF Records",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 5.3 a",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-5.3",
                }
            ],
        },
        "fr": {
            "tagName": "A-all",
            "guidance": 'Entrée "a" sans nom d\'hôte',
            "refLinksGuide": [
                {
                    "description": "B.1.1 Enregistrements SPF",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb11",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 5.3 a (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-5.3",
                }
            ],
        },
    },
    "spf11": {
        "en": {
            "tagName": "INCLUDE-limit",
            "guidance": "More than 10 lookups -- Follow implementation guide",
            "refLinksGuide": [
                {
                    "description": "B.1.3 DNS Lookup Limit",
                    "ref_link": "https://cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection#annb13",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.4 DNS Lookup Limits",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.4",
                }
            ],
        },
        "fr": {
            "tagName": "INCLUDE-limit",
            "guidance": "Plus de 10 lookups -- Suivre le guide d'implémentation",
            "refLinksGuide": [
                {
                    "description": "B.1.3 Limite de recherches DNS",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier#annb13",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 4.6.4 DNS Lookup Limits (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-4.6.4",
                }
            ],
        },
    },
    "spf12": {
        "en": {
            "tagName": "SPF-valid",
            "guidance": "SPF record is properly formed",
            "refLinksGuide": [
                {
                    "description": "Implementation Guidance: Email Domain Protection",
                    "ref_link": "https://www.cyber.gc.ca/en/guidance/implementation-guidance-email-domain-protection",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
        "fr": {
            "tagName": "SPF-valid",
            "guidance": "L'enregistrement SPF est correctement formé",
            "refLinksGuide": [
                {
                    "description": "Directives de mise en œuvre - protection du domaine de courrier",
                    "ref_link": "https://www.cyber.gc.ca/fr/orientation/directives-de-mise-en-oeuvre-protection-du-domaine-de-courrier",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "RFC 7208 (SPF), 3 SPF Records (EN)",
                    "tech_link": "https://tools.ietf.org/html/rfc7208#section-3",
                }
            ],
        },
    },
}


ssl_tag_data = {
    "ssl1": {
        "en": {
            "tagName": "SSL-GC",
            "guidance": "Government of Canada domains subject to TBS guidelines",
            "refLinksGuide": [
                {
                    "description": "ITPIN 2018-01",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "SSL-GC",
            "guidance": "Les domaines du gouvernement du Canada sont soumis aux directives du SCT",
            "refLinksGuide": [
                {
                    "description": "AMPTI 2018-01",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
    "ssl2": {
        "en": {
            "tagName": "SSL-missing",
            "guidance": "Follow implementation guide",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "SSL-missing",
            "guidance": "Suivre le guide de mise en œuvre",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl3": {
        "en": {
            "tagName": "SSL-rc4",
            "guidance": "Accepted cipher list contains RC4 stream cipher, as prohibited by BOD 18.01",
            "refLinksGuide": [
                {
                    "description": "6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "SSL-rc4",
            "guidance": "La liste de chiffrement acceptée contient le chiffrement de flux RC4, interdit par le BOD 18.01",
            "refLinksGuide": [
                {
                    "description": "6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl4": {
        "en": {
            "tagName": "SSL-3des",
            "guidance": "Accepted cipher list contains 3DES symmetric-key block cipher, as prohibited by BOD 18-01",
            "refLinksGuide": [
                {
                    "description": "6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "SSL-3des",
            "guidance": "La liste de chiffrement acceptée contient le chiffrement par blocs à clé symétrique 3DES, interdit par le BOD 18-01",
            "refLinksGuide": [
                {
                    "description": "6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl5": {
        "en": {
            "tagName": "SSL-acceptable-certificate",
            "guidance": "Certificate chain signed using SHA-256/SHA-384/AEAD",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "SSL-acceptable-certificate",
            "guidance": "Chaîne de certificats signée en utilisant SHA-256/SHA-384/AEAD",
            "refLinksGuide": [
                {
                    "description": "6.1.3 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl6": {
        "en": {
            "tagName": "SSL-invalid-cipher",
            "guidance": "One or more ciphers in use are not compliant with guidelines",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4/6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "SSL-invalid-cipher",
            "guidance": "Un ou plusieurs chiffrements utilisés ne sont pas conformes aux directives",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4/6.1.5 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl7": {
        "en": {
            "tagName": "Vulnerability-heartbleed",
            "guidance": "Vulnerable to heartbleed bug",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "See ITSP.40.062 for approved cipher list",
                    "ref_link": "https://cyber.gc.ca/en/guidance/guidance-securely-configuring-network-protocols-itsp40062",
                }
            ],
        },
        "fr": {
            "tagName": "Vulnerability-heartbleed",
            "guidance": "Vulnérable au bogue Heartbleed",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [
                {
                    "description": "Voir ITSP.40.062 pour la liste de chiffrement approuvée",
                    "ref_link": "https://cyber.gc.ca/fr/orientation/conseils-sur-la-configuration-securisee-des-protocoles-reseau-itsp40062",
                }
            ],
        },
    },
    "ssl8": {
        "en": {
            "tagName": "Vulnerability-ccs-injection",
            "guidance": "Vulnerable to OpenSSL CCS Injection",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4 Direction",
                    "ref_link": "https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/policy-implementation-notices/implementing-https-secure-web-connections-itpin.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
        "fr": {
            "tagName": "Vulnerability-ccs-injection",
            "guidance": "Vulnérable à l'injection CCS d'OpenSSL",
            "refLinksGuide": [
                {
                    "description": "6.1.3/6.1.4 Direction",
                    "ref_link": "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/technologiques-modernes-nouveaux/avis-mise-oeuvre-politique/mise-oeuvre-https-connexions-web-securisees-ampti.html#toc6",
                }
            ],
            "refLinksTechnical": [""],
        },
    },
}
