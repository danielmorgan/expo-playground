$ports = @(
	# expo / metro
	8081,
	19000,
	19002,
	19006,

	# api
	5000
);

# open ports in Windows Firewall
# --------------------------------
$wslAddress = (wsl -- ip -o -4 -json addr list eth0 `
	| ConvertFrom-Json `
	| %{ $_.addr_info.local } `
	| ?{ $_ })


$listenAddress = '0.0.0.0';

foreach ($port in $ports) {
  Invoke-Expression "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$listenAddress" 2>&1 | Out-Null;
  Invoke-Expression "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$listenAddress connectport=$port connectaddress=$wslAddress" 2>&1 | Out-Null;
}

$fireWallDisplayName = 'WSL Port Forwarding';
$portsStr = $ports -join ",";

Invoke-Expression "Remove-NetFireWallRule -DisplayName '$fireWallDisplayName'" 2>&1 | Out-Null;
Invoke-Expression "New-NetFireWallRule -DisplayName '$fireWallDisplayName' -Direction Outbound -LocalPort $portsStr -Action Allow -Protocol TCP" 2>&1 | Out-Null;
Invoke-Expression "New-NetFireWallRule -DisplayName '$fireWallDisplayName' -Direction Inbound -LocalPort $portsStr -Action Allow -Protocol TCP" 2>&1 | Out-Null;
