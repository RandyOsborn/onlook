'use client';

import { Icons } from '@onlook/ui/icons';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface CarouselImage {
    src: string;
    alt: string;
}

const placeholderImages: CarouselImage[] = [
    { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=800&fit=crop', alt: 'Modern UI Design' },
    { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop', alt: 'Abstract Design Pattern' },
    { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=600&fit=crop', alt: 'Geometric Design' },
    { src: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=800&fit=crop', alt: 'Gradient Design' },
    { src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=800&fit=crop', alt: '3D Abstract Design' },
    { src: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&h=600&fit=crop', alt: 'Minimalist Design' },
    { src: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=800&fit=crop', alt: 'Futuristic Design' },
    { src: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=600&h=800&fit=crop', alt: 'Creative Layout' },
    { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop', alt: 'Gradient Background' },
    { src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop', alt: 'Watercolor Design' }
];

export function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: 'x',
        loop: true,
        align: 'center',
        containScroll: 'trimSnaps',
        skipSnaps: false,
        dragFree: false,
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Main carousel container */}
            <div className="relative h-[400px] bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20">
                {/* Embla viewport */}
                <div className="embla__viewport h-full" ref={emblaRef}>
                    <div className="embla__container h-full flex">
                        {placeholderImages.map((image, index) => (
                            <div
                                key={index}
                                className="embla__slide flex-[0_0_100%] min-w-0 relative flex items-center justify-center"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={800}
                                    height={400}
                                    className="object-contain w-full h-full"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={scrollPrev}
                    disabled={!prevBtnEnabled}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-foreground-primary/20 transition-all ${
                        prevBtnEnabled 
                            ? 'hover:bg-background hover:border-foreground-primary/40 cursor-pointer' 
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                    aria-label="Previous image"
                >
                    <Icons.ChevronUp className="w-5 h-5 text-foreground-primary rotate-[-90deg]" />
                </button>
                <button
                    onClick={scrollNext}
                    disabled={!nextBtnEnabled}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-foreground-primary/20 transition-all ${
                        nextBtnEnabled 
                            ? 'hover:bg-background hover:border-foreground-primary/40 cursor-pointer' 
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                    aria-label="Next image"
                >
                    <Icons.ChevronDown className="w-5 h-5 text-foreground-primary rotate-[-90deg]" />
                </button>

                {/* Image indicator dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {placeholderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex 
                                    ? 'bg-foreground-primary w-6' 
                                    : 'bg-foreground-primary/30 hover:bg-foreground-primary/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Image caption */}
            <p className="text-center text-sm text-foreground-secondary mt-3">
                {placeholderImages[currentIndex]?.alt}
            </p>
        </div>
    );
}