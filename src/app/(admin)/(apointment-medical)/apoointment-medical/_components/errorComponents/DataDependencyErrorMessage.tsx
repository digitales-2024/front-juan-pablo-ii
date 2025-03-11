import { AlertCircle } from 'lucide-react'
import React from 'react'
import { ERRORS } from '../../_statics/errors';
import { DataDependency } from '@/types/statics/pageMetadata';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    error: Error;
    dataDependencies: DataDependency[];
  }

export default function DataDependencyErrorMessage({
    error,
    children,
    dataDependencies,
  }: ErrorProps) {


  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold">Advertencia</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {error.message || ERRORS.generic}
          </p>
          <div>
            {children}
          </div>
          <div className='flex flex-wrap justify-center mt-4 space-x-4 w-full'>
            {
              dataDependencies.map((dependency, index) => {
                return dependency.dependencyUrl && (
                  <Link key={index} href={dependency.dependencyUrl} className={buttonVariants({
                    variant: 'outline',
                  })}>
                    <span>
                      Ir a {dependency.dependencyName}
                    </span>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
  )
}
