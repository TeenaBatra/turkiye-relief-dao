'use client'

import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

// All the cryptocurrency networks must be listed here
const networks = [
  'Bitcoin',
  'Ethereum',
  'Avalanche',
  'Binance',
  'Polygon',
  'Solana',
  'Cosmos',
  'Polkadot',
  'Tron',
];

// All of the icons should be SVGs
// Click "raw" and copy the url from the list at https://github.com/spothq/cryptocurrency-icons/tree/master/svg/color
// All option types except "cryptocurrency" and "nft" must have an icon in this map.
// All "cryptocurrency" and "nft" types must have exact names in their respective maps.
const icons = {
  cryptocurrencies: {
    'Bitcoin': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/btc.svg',
    'Ethereum': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg',
    'Avalanche': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/avax.svg',
    'Binance': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/bnb.svg',
    'Polygon': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/matic.svg',
    'Solana': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg',
    'Cosmos': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/atom.svg',
    'Polkadot': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/dot.svg',
    'Tron': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/trx.svg',
  },
  nfts: {
    'Cause #1': './icons/cause.svg',
  },
  bank: './icons/bank.svg',
  btcturk: './icons/btcturk.svg',
  card: './icons/card.svg'
};

// All entries must have the following: name, description, websiteUrl, twitterUrl, popularity, endorsementUrls, categories, options
// Categories must include:
//   * One of: governmental, ngo, individual
//   * One of: turkish, international
// All options must have the following: type, name
//   * If an option has "cryptocurrency" type, it must include: address, sourceUrls
//   * If an option has another type, it must include: linkName, linkUrl
//   * Options could have the following: info, warning
const organizations = [
  {
    name: 'AFAD (Republic Of Turkey Ministry Of Interior Disaster And Emergency Management Presidency)',
    description: 'Disaster and Emergency Management Authority, an institution working to prevent disasters and minimize disaster-related damages, plan and coordinate post-disaster response, and promote cooperation among various government agencies.',
    websiteUrl: 'https://en.afad.gov.tr/',
    twitterUrl: 'https://twitter.com/AFADTurkiye',
    popularity: 6,
    endorsementUrls: [],
    categories: ['governmental', 'turkish'],
    options: [
      {
        type: 'cryptocurrency',
        name: 'Bitcoin',
        address: 'bc1q30uv6s9gwyzq2fd5hhc06v7xge3zzg3qa99vuv0w5dfmxgq8vnws97dpcl',
        sourceUrls: ['https://donation.btcturk.com/', 'https://twitter.com/btcturkpro/status/1623344419976929282'],
      },
      {
        type: 'cryptocurrency',
        name: 'Ethereum',
        address: '0x64A994CC850a56e87331d880A23A69b16dbFC8ea',
        sourceUrls: ['https://donation.btcturk.com/', 'https://twitter.com/btcturkpro/status/1623344419976929282'],
        warning: 'Only send ETH or USDT as this is an exchange wallet',
      },
      {
        type: 'bank',
        name: 'Bank accounts',
        linkName: 'The list of AFAD bank accounts on their official website',
        linkUrl: 'https://en.afad.gov.tr/earthquake-donation-accounts',
      },
      {
        type: 'btcturk',
        name: 'BtcTurk',
        linkName: 'Instructions for donating Turkish Lira from BtcTurk',
        linkUrl: 'https://pro.btcturk.com/deprem-bagis',
        info: 'Matched 1:1 by BtcTurk',
        warning: 'Only Turkish citizens can register to BtcTurk',
      },
    ],
  },
  {
    name: 'Ahbap',
    description: 'A Turkey based non-profit organization established on the principles of solidarity and cooperation, founded by the Turkish musician and philanthropist, Haluk Levent.',
    websiteUrl: 'https://ahbap.org/',
    twitterUrl: 'https://twitter.com/ahbap',
    popularity: 10,
    endorsementUrls: ['https://twitter.com/avalancheavax/status/1622975707528962049'],
    categories: ['ngo', 'turkish'],
    options: [
      {
        type: 'cryptocurrency',
        name: 'Ethereum',
        address: '0xe1935271D1993434A1a59fE08f24891Dc5F398Cd',
        sourceUrls: ['https://twitter.com/ahbap/status/1622963311514996739'],
      },
      {
        type: 'cryptocurrency',
        name: 'Avalanche',
        address: '0x868D27c361682462536DfE361f2e20B3A6f4dDD8',
        sourceUrls: ['https://twitter.com/ahbap/status/1622963311514996739'],
      },
      {
        type: 'cryptocurrency',
        name: 'Binance',
        address: '0xB67705398fEd380a1CE02e77095fed64f8aCe463',
        sourceUrls: ['https://twitter.com/ahbap/status/1622963311514996739'],
      },
      {
        type: 'bank',
        name: 'Bank accounts',
        linkName: 'The list of Ahbap bank accounts on their official website',
        linkUrl: 'https://ahbap.org/disasters-turkey',
      },
    ],
  },
  {
    name: 'NeedsMap',
    description: 'An online social platform cooperative based in Turkey, where individuals and organizations wishing to support those in need can connect',
    websiteUrl: 'https://www.ihtiyacharitasi.org/',
    twitterUrl: 'https://twitter.com/ihtiyacharitasi',
    popularity: 3,
    endorsementUrls: ['https://twitter.com/iksv_istanbul/status/1622936410704560129'], // Turkish
    categories: ['ngo', 'turkish'],
    options: [
      {
        type: 'cryptocurrency',
        name: 'Ethereum',
        address: '0xbe4cde5eeeed1f0a97a9457f6ef5b71eae108652',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send ETH, USDC, USDT or TRYC as this is an exchange wallet',
      },
      {
        type: 'cryptocurrency',
        name: 'Bitcoin',
        address: '3PkihQfm6doGW41uZ5Q9GFNw6XpEK5g9Vk',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send BTC as this is an exchange wallet',
      },
      {
        type: 'cryptocurrency',
        name: 'Polygon',
        address: '0xbe4cde5eeeed1f0a97a9457f6ef5b71eae108652',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send MATIC as this is an exchange wallet',
      },
      {
        type: 'cryptocurrency',
        name: 'Solana',
        address: 'Fjo5AeFMbUD6gjoWKbVuMXRcPsjpXKksjKLxPFuXQhaK',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send SOL as this is an exchange wallet',
      },
      {
        type: 'cryptocurrency',
        name: 'Cosmos',
        address: 'cosmos1dm68mx9jcsyqkyzp3up7gmnu3ku84v8gf6v75u',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send ATOM with MEMO: 624143',
      },
      {
        type: 'cryptocurrency',
        name: 'Polkadot',
        address: '1haY6iHgLopw2WWmPhcdCy2jwzL2jthbNL515rUyJtnmhUt',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send DOT as this is an exchange wallet'
      },
      {
        type: 'cryptocurrency',
        name: 'Tron',
        address: 'TUAum5Q3GWZvzsS1yQaDdjkDAzp3HbvKTT',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send TRX as this is an exchange wallet'
      },
      {
        type: 'card',
        name: 'Credit Card',
        linkName: 'Option of Credit Card on their official website',
        linkUrl: 'https://fonzip.com/ihtiyacharitasi/onlineimece',
      },
    ],
  },
  {
    name: 'Community Volunteers Foundation',
    description: 'The Community Volunteer Foundation is a Turkish organization that helps young people uncover their potential through education and project development, while also addressing their housing, scholarship, and cultural needs.',
    websiteUrl: 'https://www.tog.org.tr/',
    twitterUrl: 'https://twitter.com/TOGVakfi',
    popularity: 4,
    endorsementUrls: ['https://www.tog.org.tr/destekcilerimiz/kurumsal-destekcilerimiz/'], // Turkish
    categories: ['ngo', 'turkish'],
    options: [
      {
        type: 'cryptocurrency',
        name: 'Ethereum',
        address: '0x9b40f98ccc326beaa0bfb94cfa8bfc6383a267e5',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send ETH as this is an exchange wallet',
      },
      {
        type: 'cryptocurrency',
        name: 'Tron',
        address: 'TCJ2qvKJsXE4XZD2VcyeppDWmZUGfLShMm',
        sourceUrls: ['https://www.paribu.com/blog/haberler/afet-destek-planimiz-ve-kripto-para-ile-bagis-organizasyonu-hakkinda/'], // Turkish
        warning: 'Only send TRX as this is an exchange wallet'
      },
      {
        type: 'card',
        name: 'Credit Card',
        linkName: 'Option of Credit Card on their official website',
        linkUrl: 'https://www.tog.org.tr/bagisci-ol/#tek-seferlik-bagis',
      },
      {
        type: 'bank',
        name: 'Bank accounts',
        linkName: 'The list of Community Volunteers Foundation bank accounts on their official website',
        linkUrl: 'https://www.tog.org.tr/bagisci-ol/#1630673115839-aeef1bfb-85a7',
      },
    ],
  },
  {
    name: 'Earthquake Türkiye 2023 by Murat Pak',
    description: 'Distinguished Turkish NFT artist Pak has built an NFT platform for raising funds for the relief effort. All donations are promised to be channelled to Ahbap.',
    websiteUrl: 'https://cause.quest/',
    twitterUrl: 'https://twitter.com/muratpak',
    popularity: 2,
    endorsementUrls: ['https://twitter.com/beeple/status/1623107218567581697'],
    categories: ['individual', 'turkish'],
    options: [
      {
        type: 'nft',
        name: 'Cause #1',
        linkName: 'Mint Earthquake Türkiye 2023 NFTs',
        linkUrl: 'https://cause.quest',
        warning: 'Non-transferable',
      },
    ],
  },
];

const initialSortOptions = [
  { name: 'Suggested', current: true },
  { name: 'Most Popular', current: false },
]
const initialFilters = [
  {
    id: 'types',
    name: 'Donation Types',
    options: [
      { id: 'crypto', label: 'Cryptocurrencies', checked: true },
      { id: 'nft', label: 'NFTs', checked: true },
      { id: 'card', label: 'Credit Cards', checked: true },
      { id: 'bank', label: 'Bank Transfers', checked: true },
    ],
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency Networks',
    options: [
      { id: 'bitcoin', label: 'Bitcoin', checked: true },
      { id: 'ethereum', label: 'Ethereum', checked: true },
      { id: 'avalanche', label: 'Avalanche', checked: true },
    ],
  },
  {
    id: 'categories',
    name: 'Categories',
    options: [
      { id: 'governmental', label: 'Governmental', checked: true },
      { id: 'ngo', label: 'NGO', checked: true },
      { id: 'individual', label: 'Individual', checked: true },
      { id: 'turkish', label: 'Turkish', checked: true },
      { id: 'international', label: 'International', checked: true },
    ],
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Organizations() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOptions, setSortOptions] = useState(initialSortOptions);
  const [filters, setFilters] = useState(initialFilters);
  const cryptoFilter = filters[0].options[0].checked;

  const checkboxChangeHandler = ({target}) => {
    const {checked, id} = target;
    setFilters(prev => {
      const idParts = id.split("-");
      const clickedCategory = prev.find(item => item.id.toString() === idParts[1]);
      const clickedOption = clickedCategory.options.find(item => item.id.toString() === idParts[2]);
      clickedOption.checked = checked;
      return [...prev];
    });
  }

  const changeSortHandler = ({target}) => {
    setSortOptions(prev => {
      const currentOption = prev.find(item => item.current === true);
      currentOption.current = false;
      const clickedOption = prev.find(item => item.name.toString() === target.innerText);
      clickedOption.current = true;
      return [...prev];
    });
  }

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>

                    {filters.map((section) => (
                      (section.id != 'crypto' || cryptoFilter) ?
                        <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                          {({ open }) => (
                            <>
                              <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                  <span className="font-medium text-gray-900">{section.name}</span>
                                  <span className="ml-2 flex items-center">
                                    {open ? (
                                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-6">
                                <div className="space-y-6">
                                  {section.options.map((option) => (
                                    <div key={option.id} className="flex items-center">
                                      <input
                                        id={`filter-${section.id}-${option.id}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.id}
                                        type="checkbox"
                                        defaultChecked={option.checked}

                                        onChange={checkboxChangeHandler}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}-${option.id}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      : <></>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between border-b border-gray-200 pt-24 pb-6">
            <div className="font-bold tracking-tight">
              <h2 className="text-base font-semibold text-red-600">You Can Make a Difference</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Donate Now
              </p>
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={changeSortHandler}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900 cursor-default' : 'text-gray-500 cursor-pointer',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="group inline-flex -m-2 ml-4 p-2 text-gray-700 hover:text-gray-900 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="text-gray-400 group-hover:text-gray-500 h-5 w-5 mr-1" aria-hidden="true" />
                <p className='text-sm font-medium'>
                  Filters
                </p>
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  (section.id != 'crypto' || cryptoFilter) ?
                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">{section.name}</span>
                              <span className="ml-2 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option) => (
                                <div key={option.id} className="flex items-center">
                                  <input
                                    id={`filter-${section.id}-${option.id}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.id}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    onChange={checkboxChangeHandler}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${option.id}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  : <></>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Replace with your content */}
                <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 lg:h-full" />
                {/* /End replace */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}