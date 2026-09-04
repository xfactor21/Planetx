import Image from 'next/image'

export function FloatingBrandXs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="brand-x-float brand-x-float-a">
        <Image
          src="/brand/bg-x-drip.png"
          alt=""
          width={1536}
          height={1536}
          className="h-full w-full object-contain opacity-20"
        />
      </div>
      <div className="brand-x-float brand-x-float-b">
        <Image
          src="/brand/bg-x-circuit.png"
          alt=""
          width={1536}
          height={1536}
          className="h-full w-full object-contain opacity-18"
        />
      </div>
      <div className="brand-x-float brand-x-float-c hidden lg:block">
        <Image
          src="/brand/bg-x-drip.png"
          alt=""
          width={1536}
          height={1536}
          className="h-full w-full object-contain opacity-10"
        />
      </div>
    </div>
  )
}
