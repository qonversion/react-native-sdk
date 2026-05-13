require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "qonversion-react-native-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/qonversion/qonversion-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp,swift}"
  s.private_header_files = "ios/**/*.h"

  # Resolve QonversionSandwich via Swift Package Manager (RN 0.75+).
  # CocoaPods is going read-only on 2026-12-02; spm_dependency lets us continue
  # to ship the binary XCFramework while autolinking still flows through pod install.
  # NOTE: spm_dependency forces use_frameworks! :linkage => :dynamic in the host Podfile.
  if defined?(spm_dependency)
    spm_dependency(s,
      url: 'https://github.com/qonversion/sandwich-sdk.git',
      requirement: { kind: 'exactVersion', version: '7.10.0' },
      products: ['QonversionSandwich']
    )
  else
    # Fallback for React Native < 0.75 — keep classic pod dependency.
    s.dependency "QonversionSandwich", "7.10.0"
  end

  install_modules_dependencies(s)
end
