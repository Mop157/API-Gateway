interface Arguments {
    "allowedArguments": string[];
    "scripts": {
        [key: string]: {
            "port": string;
            "arguments": string;
        };
    }
}

export const arg: Arguments = {
    "allowedArguments": [
        "-sS", "-sT", "-sU", "-sV", "-sP", "-sN", "-sF", "-sX", "-sA", "-sW", "-sM", "-sL", "-sO", "-sI", "-F", "-r", "-O", "--osscan-guess",
        "--version-intensity 1", "--version-intensity 2", "--version-intensity 3", "--version-intensity 4", "--version-intensity 5", "--version-intensity 6",
        "--version-intensity 7", "--version-intensity 8", "--version-intensity 9", "--version-light", "--version-all", "--version-trace", "-Pn", "-PS", "-PA",
        "-PU", "-PE", "-PP", "-PM", "-S", "-A", "--traceroute", "--script http-*", "-T0", "-T1", "-T2", "-T3", "-T4", "-T5", "-V", "-d"
    ],
    "scripts": {
        "fyll server scan": {"port": "1-65535", "arguments": "-T4 -A -v --script vuln,default"},
        "NSE-scripts": {"port": "1-65535", "arguments": "--script=exploit -T3 --script-args=unsafe=1"},
        "TCP and UDP scan": {"port": "T:1-1000,U:1-1000", "arguments": "-sS -sU -sV -O -T4"},
        "web-scan": {"port": "80,443", "arguments": "--script http-enum,http-vuln-cve2017-5638"},
        "Firewall Evasion": {"port": "80", "arguments": "-f -D RND:5"},
        "vulnerable SMB services": {"port": "445", "arguments": "--script smb-vuln-ms17-010"},
        "Security Audit for DNS Servers": {"port": "53", "arguments": "--script dns-zone-transfer"}
    }
}