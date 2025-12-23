'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Place } from '@/lib/store'
import { cn } from '@/lib/utils'

interface PlaceCardProps {
  place: Place
  index: number
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}

export function PlaceCard({
  place,
  index,
  isSelected,
  onClick,
  compact = false,
}: PlaceCardProps) {
  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          onClick={onClick}
          className={cn(
            'flex cursor-pointer items-center gap-3 p-3 transition-all hover:bg-muted/50',
            isSelected && 'ring-2 ring-primary'
          )}
        >
          {/* Thumbnail */}
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
            {place.imageUrl ? (
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium">{place.name}</h3>
              {place.verified && (
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {place.address}
            </p>
          </div>

          {/* Badge */}
          {place.verified && (
            <Badge variant="verified" className="flex-shrink-0">
              인증됨
            </Badge>
          )}
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          'cursor-pointer overflow-hidden transition-all hover:shadow-lg',
          isSelected && 'ring-2 ring-primary'
        )}
      >
        {/* Image */}
        <div className="relative aspect-video w-full">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {place.verified && (
            <Badge variant="verified" className="absolute right-2 top-2">
              DIVE 인증
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold">{place.name}</h3>
            <Badge variant="outline">{place.category}</Badge>
          </div>

          <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {place.address}
          </p>

          {place.description && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {place.description}
            </p>
          )}

          {place.openingHours && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {place.openingHours}
            </p>
          )}

          {place.themeRelevance && (
            <div className="mt-3 rounded-lg bg-primary/10 p-3">
              <p className="text-sm text-primary">{place.themeRelevance}</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

// Place Detail Modal Content
interface PlaceDetailProps {
  place: Place
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {place.imageUrl ? (
          <Image
            src={place.imageUrl}
            alt={place.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{place.name}</h2>
          {place.verified && (
            <Badge variant="verified">
              <CheckCircle className="mr-1 h-3 w-3" />
              DIVE 인증
            </Badge>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {place.address}
        </p>
      </div>

      {/* Theme Relevance */}
      {place.themeRelevance && (
        <div className="rounded-lg bg-primary/10 p-4">
          <h3 className="mb-2 font-semibold text-primary">테마 부합성</h3>
          <p className="text-sm">{place.themeRelevance}</p>
        </div>
      )}

      {/* Verification Score */}
      {place.verified && place.verificationScore && (
        <div className="rounded-lg bg-green-500/10 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-green-400">
            <CheckCircle className="h-4 w-4" />
            정보 검증 완료
          </h3>
          <p className="text-sm text-muted-foreground">
            신뢰도 점수: {place.verificationScore}%
          </p>
        </div>
      )}

      {/* Opening Hours */}
      {place.openingHours && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span>{place.openingHours}</span>
        </div>
      )}

      {/* External Links */}
      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
        >
          <ExternalLink className="h-4 w-4" />
          구글 지도
        </a>
        <a
          href={`https://map.kakao.com/link/to/${place.name},${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
        >
          <ExternalLink className="h-4 w-4" />
          카카오맵
        </a>
      </div>
    </div>
  )
}
