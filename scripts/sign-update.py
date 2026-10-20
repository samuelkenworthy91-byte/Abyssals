"""Sign on GitHub Actions using repository secrets; verify update compatibility."""
from pathlib import Path
import base64,hashlib,json,os,shutil,subprocess,tempfile
root=Path(__file__).resolve().parents[1]
config=json.loads((root/'release-config.json').read_text())
required=('ABYSSALS_KEYSTORE_BASE64','ABYSSALS_STORE_PASSWORD','ABYSSALS_KEY_ALIAS')
missing=[key for key in required if not os.environ.get(key)]
if missing:
 raise SystemExit('Release signing is not configured. Add these repository Actions secrets: '+', '.join(missing)+'. Use the existing Abyssals release keystore to retain update compatibility; do not generate a replacement key.')
cert='6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac'
folder=Path(tempfile.mkdtemp(prefix='abyssals-signing-',dir=os.environ.get('RUNNER_TEMP')))
try:
 folder.chmod(0o700);key=folder/'release.p12';key.write_bytes(base64.b64decode(os.environ['ABYSSALS_KEYSTORE_BASE64'],validate=True));key.chmod(0o600)
 # Check the certificate before signing, so a wrong secret cannot silently fork
 # the installed app's identity or publish an incompatible update.
 report=subprocess.check_output(['keytool','-list','-v','-keystore',str(key),'-storepass:env','ABYSSALS_STORE_PASSWORD','-alias',os.environ['ABYSSALS_KEY_ALIAS']],text=True,stderr=subprocess.STDOUT)
 if cert not in report.lower().replace(':',''):raise SystemExit('The keystore certificate does not match the installed Abyssals release. Restore the original release signing backup.')
 unsigned=root/'build'/('unsigned-'+config['version']+'.apk');out=root/'build'/config['filename']
 subprocess.run(['apksigner','sign','--ks',str(key),'--ks-key-alias',os.environ['ABYSSALS_KEY_ALIAS'],'--ks-pass','env:ABYSSALS_STORE_PASSWORD','--v1-signing-enabled','false','--v2-signing-enabled','true','--v3-signing-enabled','true','--v4-signing-enabled','false','--out',str(out),str(unsigned)],check=True)
 verified=subprocess.check_output(['apksigner','verify','--verbose','--print-certs',str(out)],text=True)
 if cert not in verified:raise SystemExit('Signed APK has an unexpected release certificate')
 subprocess.run(['zipalign','-c','4',str(out)],check=True)
 (root/'build'/('signature-verification-'+config['version']+'.txt')).write_text(verified)
 digest=hashlib.sha256(out.read_bytes()).hexdigest();out.with_suffix('.apk.sha256').write_text(digest+'  '+out.name+'\n')
 print('Signed and verified update:',out.name,digest)
finally:shutil.rmtree(folder)
