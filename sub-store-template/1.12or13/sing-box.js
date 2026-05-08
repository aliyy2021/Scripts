const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['all'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['kr-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置)).*(🇰🇷|KR|kr|韩国|首尔|Korea)/i))
  }
  if (['ae-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置)).*(🇦🇪|AE|ae|阿联酋|阿拉伯|迪拜)/i))
  }
  if (['jp-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置)).*(🇯🇵|JP|jp|日本|日|东京|Japan)/i))
  }
  if (['sg-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置)).*(🇸🇬|SG|sg|新加坡|坡|狮城|Singapore)/i))
  }
  if (['us-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置)).*(🇺🇸|US|us|美国|美|凤凰城|United States)/i))
  }
  if (['noCN-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:网站|网址|获取|订阅|流量|到期|余量|续费|过期|重置|港|hk|hongkong|Hong Kong|🇭🇰|台|🇹🇼|TW|Taiwan))/i))
}})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
